require("dotenv").config();
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const express = require("express");
require("./config/dbConnect");
require("./config/derivSocket");

const app = require("./app/app");
const PORT = process.env.PORT || 3800;
const server = http.createServer(app);

// Configure CORS
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000", // Your React client URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Deriv API WebSocket setup
const WebSocket = require('ws');
const DERIV_API_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=64213';
const assetConnections = {};
let roomCount = 0; // Counter for unique asset rooms

// Function to fetch live data for a specific asset
function fetchAssetData(asset) {
    if (assetConnections[asset]) return; // If already connected

    const ws = new WebSocket(DERIV_API_URL);

    ws.on('open', () => {
        console.log(`Subscribed to live data for asset: ${asset}`);
        const request = {
            ticks: asset // Subscribe to the asset
        };
        ws.send(JSON.stringify(request));
    });

    ws.on('message', (data) => {
        const response = JSON.parse(data);
        if (response.tick) {
            // Send live data to all users in the same room (asset room)
            io.to(asset).emit('assetData', response.tick);
        }
    });

    ws.on('close', () => {
        console.log(`WebSocket closed for asset: ${asset}`);
        delete assetConnections[asset];
    });

    ws.on('error', (err) => {
        console.error(`WebSocket error for asset: ${asset}`, err);
    });

    // Store the WebSocket connection for this asset
    assetConnections[asset] = ws;
}

// Function to unsubscribe from the asset data when the room is empty
function unsubscribeAssetData(asset) {
    if (assetConnections[asset]) {
        assetConnections[asset].close();
        delete assetConnections[asset];
        console.log(`Unsubscribed from live data for asset: ${asset}`);
    }
}

// Socket.IO connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for joining an asset room
    socket.on('joinAssetRoom', (asset) => {
        socket.join(asset);
        console.log(`User ${socket.id} joined asset room: ${asset}`);

        // Check if this is a new room
        const roomSize = io.sockets.adapter.rooms.get(asset)?.size || 0;
        if (roomSize === 1) { // First user in the room
            roomCount++;
            console.log(`New room created for asset: ${asset}. Total rooms: ${roomCount}`);
        }

        // Fetch live data for this asset
        fetchAssetData(asset);
    });

    // Listen for leaving an asset room
    socket.on('leaveAssetRoom', (asset) => {
        console.log(`User ${socket.id} left asset room: ${asset}`);
        socket.leave(asset);

        // Check if room is empty and unsubscribe if no users left
        const roomSize = io.sockets.adapter.rooms.get(asset)?.size || 0;
        if (roomSize === 0) {
            unsubscribeAssetData(asset);
            roomCount--; // Decrement the room count
            console.log(`Room for asset ${asset} is empty. Total rooms: ${roomCount}`);
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Check each room the user was part of
        const rooms = Object.keys(socket.rooms);
        rooms.forEach((room) => {
            socket.leave(room);

            // Check if room is empty and unsubscribe if no users left
            const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
            if (roomSize === 0) {
                unsubscribeAssetData(room);
                roomCount--; // Decrement the room count
                console.log(`Room for asset ${room} is empty. Total rooms: ${roomCount}`);
            }
        });
    });

    // Listen for messages from the client
    socket.on('message', (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);
        // Send message back to the client
        socket.emit('message', `Server received: ${msg}`);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

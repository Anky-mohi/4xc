const WebSocket = require('ws');

const DERIV_API_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=64213'; // Replace with your Deriv app ID

// Store active WebSocket connections for each asset room
const assetConnections = {};

// Function to fetch live data for a specific asset
function fetchAssetData(asset, io) {
  // If there's already a connection for this asset, return the existing one
//   if (assetConnections[asset]) return assetConnections[asset];

  const ws = new WebSocket(DERIV_API_URL);

  ws.on('open', () => {
    console.log(`Subscribed to live data for asset: ${asset}`);
    const request = {
      "ticks": asset
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
  return ws;
}

// Function to unsubscribe from the asset data when the room is empty
function unsubscribeAssetData(asset) {
  if (assetConnections[asset]) {
    assetConnections[asset].close();
    delete assetConnections[asset];
    console.log(`Unsubscribed from live data for asset: ${asset}`);
  }
}

// Export the room logic as a module
const roomManager = (io) => {
    console.log("connect")
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join asset room
    socket.on('joinAssetRoom', (asset) => {
      console.log(`User ${socket.id} joined asset room: ${asset}`);
      socket.join(asset);

      // Fetch live data for this asset
      fetchAssetData(asset, io);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);

      // Check each room the user was part of
      const rooms = Object.keys(socket.rooms);
      rooms.forEach((room) => {
        // Leave the asset room
        socket.leave(room);

        // Check if room is empty and unsubscribe if no users left
        const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
        if (roomSize === 0) {
          unsubscribeAssetData(room);
        }
      });
    });

    // Handle user leaving a specific room
    socket.on('leaveAssetRoom', (asset) => {
      console.log(`User ${socket.id} left asset room: ${asset}`);
      socket.leave(asset);

      // Check if room is empty and unsubscribe if no users left
      const roomSize = io.sockets.adapter.rooms.get(asset)?.size || 0;
      if (roomSize === 0) {
        unsubscribeAssetData(asset);
      }
    });
  });
};

module.exports = roomManager;

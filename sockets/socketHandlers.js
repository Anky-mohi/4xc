const { DERIV_API_URL } = require("../config/constants");
const WebSocket = require("ws");

const assetConnections = {}; // Store active WebSocket connections by asset

// Function to fetch live data for a specific asset
const fetchAssetData = (asset, io) => {
  if (assetConnections[asset]) return; // Already connected

  const ws = new WebSocket(DERIV_API_URL);

  ws.on("open", () => {
    console.log(`Subscribed to live data for asset: ${asset}`);
    ws.send(JSON.stringify({ ticks: asset })); // Subscribe to asset ticks
  });

  ws.on("message", (data) => {
    const response = JSON.parse(data);
    if (response.tick) {
      console.log('tick', response.tick)
      // Emit live data to clients in the asset room
      io.to(asset).emit("assetData", response.tick);
    }
  });

  ws.on("close", () => {
    console.log(`WebSocket closed for asset: ${asset}`);
    delete assetConnections[asset]; // Clean up on close
  });

  ws.on("error", (err) => {
    console.error(`WebSocket error for asset: ${asset}`, err);
    delete assetConnections[asset]; // Clean up on error
  });

  // Store the WebSocket connection for this asset
  assetConnections[asset] = ws;
};

// Function to unsubscribe from asset data
const unsubscribeAssetData = (asset) => {
  if (assetConnections[asset]) {
    assetConnections[asset].close();
    delete assetConnections[asset];
    console.log(`Unsubscribed from live data for asset: ${asset}`);
  }
};

// Handle socket connections
const handleSocketConnection = (socket, io) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinAssetRoom", (asset) => {
    socket.join(asset);
    console.log(`User ${socket.id} joined asset room: ${asset}`);
    fetchAssetData(asset, io); // Fetch live data for the asset
  });

  socket.on("leaveAssetRoom", (asset) => {
    console.log(`User ${socket.id} left asset room: ${asset}`);
    socket.leave(asset);
    unsubscribeAssetData(asset); // Unsubscribe if no users left
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Optionally handle any cleanup needed on disconnect
  });
};

module.exports = {
  handleSocketConnection,
};

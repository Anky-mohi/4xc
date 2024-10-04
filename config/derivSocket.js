// websocket.js (create a file for WebSocket connection)
const WebSocket = require("ws");

const derivSocket = new WebSocket(
  "wss://ws.binaryws.com/websockets/v3?app_id=64437"
);

derivSocket.on("open", () => {
  console.log("Connected to Deriv WebSocket");
});

derivSocket.on("close", () => {
  console.log("Disconnected from Deriv WebSocket");
});

derivSocket.on("error", (error) => {
  console.error("WebSocket error:", error);
});

module.exports = derivSocket;

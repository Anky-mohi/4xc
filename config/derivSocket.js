const WebSocket = require("ws");
const { DERIV_API_URL, DERIV_API_TOKEN } = require("../config/constants");

let derivSocket;
let isConnected = false;

// Create the Deriv WebSocket connection
const createDerivSocket = () => {
    derivSocket = new WebSocket(DERIV_API_URL);

    derivSocket.on("open", () => {
        isConnected = true;
        console.log("Connected to Deriv WebSocket");
    });

    derivSocket.on("close", () => {
        isConnected = false;
        console.log("Disconnected from Deriv WebSocket");
    });

    derivSocket.on("error", (error) => {
        console.error("WebSocket error:", error);
        isConnected = false;
    });

    // Cleanup any existing listeners to prevent memory leaks
    // derivSocket.removeAllListeners(); // Ensure no duplicate listeners exist
};

// Get the WebSocket connection
const getDerivSocket = () => {
    if (!derivSocket || !isConnected) {
        console.log("Reconnecting to Deriv WebSocket...");
        createDerivSocket();
    }
    return derivSocket;
};

module.exports = { getDerivSocket };
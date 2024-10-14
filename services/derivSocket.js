const WebSocket = require("ws");
const { DERIV_WS_URL, DERIV_APP_ID } = require("../config/constants");

class DerivSocket {
  constructor(authToken) {
    this.wsUrl = `${DERIV_WS_URL}?app_id=${DERIV_APP_ID}`;  // Use static appId
    this.authToken = authToken;
    this.socket = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.wsUrl);

      this.socket.on("open", () => {
        // Authorize on connection
        this.sendMessage({ authorize: this.authToken });
      });

      this.socket.on("message", (data) => {
        const response = JSON.parse(data);
        this.handleMessage(response, resolve, reject);
      });

      this.socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      });

      this.socket.on("close", () => {
        console.log("WebSocket connection closed");
      });
    });
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open.");
    }
  }

  handleMessage(response, resolve, reject) {
    const { msg_type, error } = response;

    if (msg_type === "authorize") {
      if (error) {
        reject(new Error(`Authorization failed: ${error.message}`));
      } else {
        resolve(); // Resolve once authorized successfully
      }
      return; // Skip further processing of the "authorize" message
    }

    // Handle other messages
    if (this.messageResolver) {
      this.messageResolver(response); // Resolve message promise
    }
  }

  // Function that returns a promise which resolves when a message is received
  async onMessage() {
    return new Promise((resolve) => {
      this.messageResolver = resolve; // Save resolve function to call when message is received
    });
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

module.exports = DerivSocket;

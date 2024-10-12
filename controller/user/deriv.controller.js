const { getDerivSocket } = require("../../config/derivSocket");


const getDerivResponse = (req, res) => {
  const derivSocket = getDerivSocket();
  const obj = req.body;

  let responseSent = false; // Flag to track if response is sent

  derivSocket.on("open", () => {
    derivSocket.send(JSON.stringify(obj));
  });

  derivSocket.on("message", (data) => {
    const response = JSON.parse(data);
    if (!responseSent) {
      responseSent = true; // Mark response as sent
      derivSocket.close(); // Close the WebSocket after the response is sent
      return res.status(200).send(response);
    }
  });

  derivSocket.on("error", (error) => {
    console.error("WebSocket error:", error);
    if (!responseSent) {
      responseSent = true; // Mark response as sent
      derivSocket.close(); // Ensure WebSocket is closed on error
      return res.status(400).send({ error: "WebSocket error: " + error.message });
    }
  });

  derivSocket.on("close", () => {
    console.log("WebSocket connection closed.");
  });
};

const getResponseFromDeriv = (request) => {
  return new Promise((resolve, reject) => {
    const derivSocket = getDerivSocket();

    derivSocket.on("open", () => {
      derivSocket.send(JSON.stringify(request));
    });

    derivSocket.on("message", (data) => {
      const response = JSON.parse(data);
      resolve(response);
      derivSocket.close(); // Close the WebSocket after receiving the response
    });

    derivSocket.on("error", (error) => {
      console.error("WebSocket error:", error);
      reject(new Error("WebSocket error: " + error.message));
    });

    derivSocket.on("close", () => {
      console.log("WebSocket connection closed.");
    });
  });
};

module.exports = {
  getDerivResponse,
  getResponseFromDeriv,
};

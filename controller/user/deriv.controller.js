const { WebSocket } = require("ws");
const { getDerivSocket } = require("../../config/derivSocket");
const  DerivSocket  = require("../../services/derivSocket");
const { DERIV_API_URL } = require("../../config/constants");

const getDerivResponse = async (req, res) => {
  const { derivtoken } = req.headers;
  const derivSocket = new DerivSocket(derivtoken);
  try {
    await derivSocket.connect();
    derivSocket.sendMessage(req.body);

    const response = await derivSocket.onMessage();

    console.log("Response received:", response); // Log the response for debugging
    return res.status(200).send(response);
  } catch (error) {
    console.error("WebSocket error:", error);
    return res.status(400).send({ error: "WebSocket error: " + error.message });
  } finally {
    if (derivSocket.socket && derivSocket.socket.readyState === WebSocket.OPEN) {
      derivSocket.close(); // Close only if the socket is open
    }
    console.log("WebSocket connection closed.");
  }
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

const verifyUserAuthorizeToken = async (req, res) => {
  try {
    const derivSocket = new WebSocket(DERIV_API_URL);
    derivSocket.on("open", () => {
      derivSocket.send(JSON.stringify({ authorize: req.body.authorize }))
    });

    derivSocket.on("message", (data) => {
      const response = JSON.parse(data);
      return res.status(200).send(response)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  getDerivResponse,
  getResponseFromDeriv,
  verifyUserAuthorizeToken
};

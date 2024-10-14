const Wallet = require("../../models/wallet.model");
const { getDerivSocket } = require("../../config/derivSocket");
const DerivSocket = require("../../services/derivSocket");
const { WebSocket } = require("ws");

// Function to authorize a user and fetch their balance
const authorizeAndFetchBalance = (userToken) => {
  return new Promise((resolve, reject) => {
    const derivSocket = getDerivSocket();

    // Authorize the user
    derivSocket.send(JSON.stringify({ authorize: userToken }));

    // Handle the WebSocket response
    const handleMessage = (data) => {
      const response = JSON.parse(data);

      if (response.error) {
        derivSocket.off("message", handleMessage); // Clean up listener
        return reject(response.error.message);
      }

      if (response.msg_type === "authorize") {
        // If authorized, request the balance
        derivSocket.send(JSON.stringify({ balance: 1 }));
      } else if (response.msg_type === "balance") {
        // Return balance data
        derivSocket.off("message", handleMessage); // Clean up listener
        return resolve(response.balance);
      }
    };

    derivSocket.on("message", handleMessage);
  });
};

// API to fetch and store both real and practice balances
exports.fetchAndStoreBalance = async (req, res) => {
  const userToken = req.body.userToken || "zsxrK8ulZlOJCWi"; // Deriv token
  try {
    // Fetch real balance
    const realBalance = await authorizeAndFetchBalance(userToken);

    // Check if the wallet exists for the user, otherwise create a new one
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = new Wallet({
        userId: req.user._id,
        realBalance,
        practiceBalance: 0, // Initialize with 0 if not available yet
      });
    } else {
      // Update existing wallet balances
      wallet.realBalance = realBalance;
    }

    // Save updated wallet to the database
    await wallet.save();

    return res.status(200).json({
      message: "Balances fetched and stored successfully",
      wallet,
    });
  } catch (error) {
    console.error("Error fetching or storing balance:", error);
    return res.status(500).json({
      message: "Failed to fetch or store balances",
      error: error.message,
    });
  }
};

exports.getUserWalletBalance = async (req,res) => {
  const { derivtoken } = req.headers;
  const derivSocket = new DerivSocket(derivtoken);
  try {
    await derivSocket.connect();
    derivSocket.sendMessage(req.body);

    const response = await derivSocket.onMessage();

    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).send({ error: "WebSocket error: " + error.message });
  } finally {
    if (derivSocket.socket && derivSocket.socket.readyState === WebSocket.OPEN) {
      derivSocket.close();
    }
  }
}

exports.topUpPracticeWallet = async (req,res) => {
  const { derivtoken } = req.headers;
  const derivSocket = new DerivSocket(derivtoken);
  try {
    await derivSocket.connect();
    derivSocket.sendMessage(req.body);

    const response = await derivSocket.onMessage();

    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).send({ error: "WebSocket error: " + error.message });
  } finally {
    if (derivSocket.socket && derivSocket.socket.readyState === WebSocket.OPEN) {
      derivSocket.close();
    }
  }
}
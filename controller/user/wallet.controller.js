const Wallet = require("../../models/wallet.model");
const derivSocket = require("../../config/derivSocket");
// Function to authorize and fetch balance for a specific user
// Function to authorize and fetch balance for a specific user
const authorizeAndFetchBalance = (userToken) => {
  return new Promise((resolve, reject) => {
    // Authorize the user
    derivSocket.send(
      JSON.stringify({
        authorize: userToken,
      })
    );

    // Listen for the authorization message
    const authListener = (data) => {
      const response = JSON.parse(data);

      if (response.error) {
        derivSocket.removeListener("message", authListener); // Remove listener after use
        return reject(response.error.message);
      }

      // Fetch the balance once authorized
      derivSocket.send(
        JSON.stringify({
          balance: 1,
        })
      );

      // Listen for the balance message
      const balanceListener = (balanceData) => {
        const balanceResponse = JSON.parse(balanceData);
        if (balanceResponse.msg_type === "balance") {
          derivSocket.removeListener("message", balanceListener); // Remove listener after use
          // console.log(balanceResponse, "kkkkkkkkkkkkkkkkk");
          return resolve(balanceResponse.balance);
        } else if (balanceResponse.error) {
          derivSocket.removeListener("message", balanceListener); // Remove listener after use
          return reject(balanceResponse.error.message);
        }
      };

      // Add the balance listener
      derivSocket.on("message", balanceListener);
    };

    // Add the authorization listener
    derivSocket.on("message", authListener);
  });
};

// API to fetch and store both real and practice balances
exports.fetchAndStoreBalance = async (req, res) => {
  let { userToken } = req.body; // The Deriv token provided by the user
  userToken = "zsxrK8ulZlOJCWi";
  try {
    // Fetch real balance
    const realBalance = await authorizeAndFetchBalance(userToken);
    console.log(realBalance, "eeeee");
    // return;

    // Check if the wallet exists for the user
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      // Create a new wallet if it doesn't exist
      wallet = new Wallet({
        userId: req.user._id,
        realBalance,
        practiceBalance,
      });
    } else {
      // Update existing wallet with new balances
      wallet.realBalance = realBalance;
      wallet.practiceBalance = practiceBalance;
    }

    // Save wallet to the database
    await wallet.save();

    res.status(200).json({
      message: "Balances fetched and stored successfully",
      wallet,
    });
  } catch (error) {
    console.error("Error fetching or storing balance:", error);
    res.status(500).json({
      message: "Failed to fetch or store balances",
      error: error.message,
    });
  }
};

const User = require("../../models/user.model");

// const derivSocket = require('../../middlwares/websocket.middlware');

// const startTrade = (req, res) => {
//   // Send a message to start trading
//   const tradeDetails = {
//     proposal: 1,
//     amount: 10,
//     basis: 'stake',
//     contract_type: 'CALL',
//     currency: 'USD',
//     duration: 60,
//     duration_unit: 's',
//     symbol: 'frxUSDJPY',
//   };

//   derivSocket.send(JSON.stringify(tradeDetails));

//   derivSocket.onmessage = (msg) => {
//     const data = JSON.parse(msg.data);
//     res.status(200).json({ status: 'success', data });
//   };
// };

// module.exports = {
//   startTrade,
// };


const getWalletBalance = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json({ balance: user.wallet.balance });
    } catch (error) {
      console.error('Error fetching balance: ', error);
      res.status(500).json({ message: 'Error fetching balance' });
    }
};

const reloadWallet = async (req, res) => {
    const { userId } = req.params;
    const reloadAmount = 1000;  // Example reload amount
    const reloadCooldown = 24 * 60 * 60 * 1000;  // 24 hours in milliseconds
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const currentTime = new Date();
      const lastReloadTime = user.wallet.lastReloadTime || new Date(0);  // Default to epoch time if never reloaded
      const timeSinceLastReload = currentTime - lastReloadTime;
  
      // Check if 24 hours have passed since last reload
      if (timeSinceLastReload < reloadCooldown) {
        const remainingTime = Math.round((reloadCooldown - timeSinceLastReload) / (60 * 60 * 1000));  // Convert to hours
        return res.status(403).json({ message: `Reload not allowed. Try again in ${remainingTime} hours.` });
      }
  
      // Allow reload if 24 hours have passed
      user.wallet.balance += reloadAmount;
      user.wallet.lastReloadTime = currentTime;  // Set the current time as the last reload time
      await user.save();
  
      res.status(200).json({ balance: user.wallet.balance, message: 'Wallet reloaded successfully' });
    } catch (error) {
      console.error('Error reloading wallet: ', error);
      res.status(500).json({ message: 'Error reloading wallet' });
    }
  };

  
  const uploadKYC = async (req, res) => {
    const { userId } = req.params;
    const { idProof, addressProof } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.kycStatus.documents.idProof = idProof;
      user.kycStatus.documents.addressProof = addressProof;
      user.kycStatus.isVerified = false;  // Set to false until reviewed
  
      await user.save();
      res.status(200).json({ message: 'KYC documents uploaded successfully, pending verification' });
    } catch (error) {
      console.error('Error uploading KYC: ', error);
      res.status(500).json({ message: 'Error uploading KYC' });
    }
  };
  
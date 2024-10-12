const Asset = require("../../models/assests.model");
const { getDerivSocket } = require("../../config/derivSocket");
const WebSocket = require('ws');

// Function to fetch assets from Deriv
const fetchAssetsFromDeriv = () => {
  return new Promise((resolve) => {
      const derivSocket = getDerivSocket();

      // Check if the socket is open
      const checkConnection = setInterval(() => {
          if (derivSocket.readyState === WebSocket.OPEN) {
              // Clear the interval once the socket is ready
              clearInterval(checkConnection);

              // Create a listener for the message event
              const messageHandler = (data) => {
                  try {
                      const response = JSON.parse(data);
                      if (response.msg_type === 'active_symbols') {
                          resolve(response.active_symbols); // Resolve with assets data
                      } else {
                          console.warn('Invalid response type:', response.msg_type);
                      }
                  } catch (error) {
                      console.error('Error parsing response:', error);
                  }
              };

              // Add the message listener
              derivSocket.once('message', messageHandler);

              // Send the request for active symbols
              derivSocket.send(JSON.stringify({ active_symbols: 'full', product_type: 'basic' }));
          }
      }, 100); // Check every 100 milliseconds
  });
};
// API to get list of assets from the database
const getListOfAssets = async (req, res) => {
  try {
    const assets = await Asset.find(); // Fetch all assets
    res.status(200).json({
      status: 1,
      data: assets,
      message: 'Assets retrieved successfully'
    });
  } catch (err) {
    console.error('Error fetching assets:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// API to get the real-time price of an asset
const getPrice = (req, res) => {
  const { symbol } = req.params;
  const derivSocket = getDerivSocket();

  // Subscribe to real-time price of a specific asset
  derivSocket.send(JSON.stringify({ ticks: symbol }));

  derivSocket.once('message', (data) => {
    try {
      const response = JSON.parse(data);
      if (response.tick) {
        res.json({ symbol: response.tick.symbol, price: response.tick.quote });
      } else {
        res.status(404).json({ message: 'No tick data available.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error processing data' });
    }
  });

  derivSocket.once('error', (error) => {
    console.error('WebSocket error:', error);
    res.status(500).json({ message: 'WebSocket connection error.' });
  });
};

module.exports = {
  fetchAssetsFromDeriv,
  getListOfAssets,
  getPrice
};

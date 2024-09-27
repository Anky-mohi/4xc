const WebSocket = require('ws');
const Asset = require("../../models/assests.model");
const derivSocket = require('../../config/derivSocket'); // Import the WebSocket connection


const fetchAssetsFromDeriv = () => {
    return new Promise((resolve, reject) => {
        const wsDeriv = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${process.env.APP_ID}`);
    
        wsDeriv.on('open', () => {
            wsDeriv.send(JSON.stringify({ active_symbols: 'full', product_type: 'basic' }));
        });
    
        wsDeriv.on('message', (data) => {
            const response = JSON.parse(data);
            if (response.msg_type === 'active_symbols') {
                resolve(response.active_symbols); // Resolve the promise with the assets data
            }
        });
    
        wsDeriv.on('error', (error) => {
            console.error('WebSocket error:', error);
            reject(error); // Reject the promise in case of error
        });
    });
};


const getListOfAssets = async (req, res) => {
    try {
        // Fetch all assets from the database
        const assets = await Asset.find(); // You can add query parameters if needed

        // Send the list of assets as a response
        res.status(200).json({
            status:1,
            data: assets,
            message: 'Assets retrieved successfully'
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ msg: 'Server error' });
    }
};

const getPrice = (req, res) => {
    const { symbol } = req.params;

    // Subscribe to real-time price of a specific asset
    derivSocket.send(JSON.stringify({
        "ticks": symbol
    }));

    // Use `once` to listen for the message only once and avoid multiple responses
    derivSocket.once('message', (data) => {
        try {
            const response = JSON.parse(data);
            if (response.tick) {
                return res.json({ symbol: response.tick.symbol, price: response.tick.quote });
            } else {
                return res.status(404).json({ message: 'No tick data available.' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error processing data' });
        }
    });

    // Handle WebSocket error
    derivSocket.on('error', (error) => {
        console.error('WebSocket error:', error);
        return res.status(500).json({ message: 'WebSocket connection error.' });
    });
};


  


module.exports = {
    fetchAssetsFromDeriv,
    getListOfAssets,
    getPrice
};
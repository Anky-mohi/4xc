const WebSocket = require('ws');
const Asset = require("../../models/assests.model");


const fetchAssetsFromDeriv = () => {
    return new Promise((resolve, reject) => {
        const wsDeriv = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${process.env.APP_ID}`);
    
        wsDeriv.on('open', () => {
            wsDeriv.send(JSON.stringify({ active_symbols: 'brief', product_type: 'basic' }));
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


module.exports = {
    fetchAssetsFromDeriv,
    getListOfAssets
};
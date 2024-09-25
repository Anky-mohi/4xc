// websocket.js (create a file for WebSocket connection)
const WebSocket = require('ws');

const derivSocket = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=64123');

derivSocket.on('open', () => {
    console.log('Connected to Deriv WebSocket');
    
    // Send a request to get the asset list
    // derivSocket.send(JSON.stringify({
    //     "active_symbols": "brief", 
    //     "product_type": "basic"
    // }));
});

// derivSocket.on('message', (data) => {
//     const response = JSON.parse(data);
//     // console.log('Received asset list:', response);
//     // You can process and store the asset list as needed
// });

derivSocket.on('close', () => {
    console.log('Disconnected from Deriv WebSocket');
});

derivSocket.on('error', (error) => {
    console.error('WebSocket error:', error);
});

module.exports = derivSocket;

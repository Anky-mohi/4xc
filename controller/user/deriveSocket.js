const WebSocket = require('ws');
require("dotenv").config();

const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id='+process.env.APP_ID);
ws.on('open', function open() {
  console.log('WebSocket connected');
  // Example request to Deriv API
  ws.send(JSON.stringify({ ticks: 'R_100' }));
});

ws.on('message', function incoming(data) {
  console.log('Received data:', data);
});

ws.on('close', function close() {
  console.log('WebSocket connection closed');
});

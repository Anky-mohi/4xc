const WebSocket = require('ws');
const { DERIV_API_URL } = require('../../config/constants');

const ws = new WebSocket(DERIV_API_URL);
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

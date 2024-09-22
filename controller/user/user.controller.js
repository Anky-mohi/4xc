const derivSocket = require('../../middlwares/websocket.middlware');

const startTrade = (req, res) => {
  // Send a message to start trading
  const tradeDetails = {
    proposal: 1,
    amount: 10,
    basis: 'stake',
    contract_type: 'CALL',
    currency: 'USD',
    duration: 60,
    duration_unit: 's',
    symbol: 'frxUSDJPY',
  };

  derivSocket.send(JSON.stringify(tradeDetails));

  derivSocket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    res.status(200).json({ status: 'success', data });
  };
};

module.exports = {
  startTrade,
};

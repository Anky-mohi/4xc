const WebSocket = require("ws");
const { DERIV_API_URL } = require("../config/constants");

const assetConnections = {};
// Handle socket connections from clients
const handleSocketConnection = (socket, io) => {

  const createProposalData = (tick, contractType) => ({
    proposal: 1,
    amount: 100,
    barrier: "+0.1",
    basis: "stake",
    contract_type: contractType,
    currency: "USD",
    duration: 60,
    duration_unit: "s",
    symbol: tick.symbol || 'RDBEAR',
  });

  const createWebSocketConnection = (asset) => {
    const ws = new WebSocket(DERIV_API_URL);

    ws.on("open", () => ws.send(JSON.stringify({ ticks: asset })));
    ws.on("message", (data) => {
      const response = JSON.parse(data);
      if (response.msg_type === 'tick' && response.tick) {
        io.to(asset).emit("assetData", response.tick);
        ws.send(JSON.stringify(createProposalData(response.tick, "CALL")));
        ws.send(JSON.stringify(createProposalData(response.tick, "PUT")));
      }
      if (response.msg_type === 'proposal' && response.proposal) {
        io.to(asset).emit("proposal", { type: response.echo_req.contract_type, data: response.proposal });
      }
      if (response.msg_type === 'transaction') {
        io.to(asset).emit("transactionUpdate", { message: 'Transaction occurred', data: response });
      }
    });

    ws.on("close", () => delete assetConnections[asset]);
    ws.on("error", () => delete assetConnections[asset]);
    assetConnections[asset] = ws;
  };

  const handleWalletUpdate = async (userInfo, socket) => {
    const { loginid, token } = userInfo;
    socket.join(loginid);
    const derivSocket = new WebSocket(DERIV_API_URL);

    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
    derivSocket.on("message", (message) => {
      const response = JSON.parse(message);
      if (response.msg_type === "authorize") {
        if (response.error) return io.to(loginid).emit("walletUpdate", { message: 'Authorization failed', error: response.error });
        derivSocket.send(JSON.stringify({ balance: 1, subscribe: 1, loginid }));
      }
      if (response.msg_type === "balance") {
        io.to(loginid).emit("walletUpdate", { balance: response.balance });
      }
    });

    derivSocket.on("error", (error) => io.to(loginid).emit("walletUpdate", { message: 'Balance fetch error', error }));
  };

  const handleWalletTopUp = async (userInfo, socket) => {
    const { loginid, token } = userInfo;
    socket.join(loginid);
    const derivSocket = new WebSocket(DERIV_API_URL);

    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
    derivSocket.on("message", (message) => {
      const response = JSON.parse(message);
      if (response.msg_type === "authorize") {
        if (response.error) return io.to(loginid).emit("walletUpdate", { message: 'Authorization failed', error: response.error });
        derivSocket.send(JSON.stringify({ topup_virtual: 1, loginid }));
        derivSocket.send(JSON.stringify({ balance: 1, subscribe: 1, loginid }));
      }
      if (response.msg_type === "balance") {
        io.to(loginid).emit("walletUpdate", response.balance);
      }
    });

    derivSocket.on("error", (error) => io.to(loginid).emit("walletUpdate", { message: 'Top-up error', error }));
  };

  const purchaseTrade = async (data) => {
    const { loginid, token } = data;
    const derivSocket = new WebSocket(DERIV_API_URL);

    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
    derivSocket.on("message", (message) => {
      const response = JSON.parse(message);
      if (response.msg_type === "authorize") {
        if (response.error) return io.to(loginid).emit("purchaseConfirmation", { message: 'Authorization failed', error: response.error });
        const { token, ...proposalData } = data;
        derivSocket.send(JSON.stringify(proposalData));
      }
      if (response.msg_type === "proposal") {
        derivSocket.send(JSON.stringify({ buy: response.proposal.id, price: data.amount, loginid }));
      }
      if (response.msg_type === "buy") {
        if (response.buy) {
          io.to(loginid).emit("purchaseConfirmation", { message: 'Purchase successful', data: response });
        } else {
          io.to(loginid).emit("purchaseConfirmation", { message: 'Purchase failed', error: response.error });
        }
      }
    });

    derivSocket.on("error", (error) => io.to(loginid).emit("purchaseConfirmation", { message: 'Purchase error', error }));
  };

  const handleTranscationHistory = async (data, socket) => {
    const { token, ...historyRequest } = data;
    socket.join(data.loginid);
    const derivSocket = new WebSocket(DERIV_API_URL);

    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
    derivSocket.on("message", (message) => {
      const response = JSON.parse(message);
      if (response.msg_type === "authorize") {
        derivSocket.send(JSON.stringify(historyRequest));
      }
      if (response.msg_type === 'profit_table') {
        io.to(data.loginid).emit("transcationHistory", response);
      }
    });
  };

  io.on('connection', (socket) => {
    socket.on("joinAssetRoom", (asset) => {
      socket.join(asset);
      if (!assetConnections[asset]) createWebSocketConnection(asset);
    });

    socket.on("purchaseTrade", (tradeData) => purchaseTrade(tradeData));
    socket.on("fetchBalance", (userInfo) => handleWalletUpdate(userInfo, socket));
    socket.on("topUpWallet", (userInfo) => handleWalletTopUp(userInfo, socket));
    socket.on("transcationHistoryRequest", (data) => handleTranscationHistory(data, socket));
  });
};

module.exports = {
  handleSocketConnection,
};

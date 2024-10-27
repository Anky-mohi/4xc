const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const ApiRoute = require('./routes/apiRoutes')
const DERIV_API_URL = "wss://ws.binaryws.com/websockets/v3";
const DERIV_APP_ID = 64508;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"], credentials: true } });
const cors = require('cors');
const assetConnections = {};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1/user', ApiRoute)

const fetchAssetData = (asset, io) => {
    if (assetConnections[asset]) return;

    const ws = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);

    ws.on("open", () => ws.send(JSON.stringify({ ticks: asset })));

    ws.on("message", (data) => {
        const response = JSON.parse(data);
        if (response.msg_type === 'tick' && response.tick) {
            io.to(asset).emit("assetData", response.tick);
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
    const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);

    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
    derivSocket.on("message", (message) => {
        const response = JSON.parse(message);
        if (response.msg_type === "authorize") {
            if (response.error) return io.to(loginid).emit("walletUpdate", { message: 'Authorization failed', error: response.error });
            derivSocket.send(JSON.stringify({ balance: 1, subscribe: 1, loginid }));
        }
        if (response.msg_type === "balance") {
            io.to(loginid).emit("walletUpdate", response);
        }
    });

    derivSocket.on("error", (error) => io.to(loginid).emit("walletUpdate", { message: 'Balance fetch error', error }));
};

const handleWalletTopUp = async (userInfo, socket) => {
    const { loginid, token } = userInfo;
    socket.join(loginid);
    const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);
    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
    derivSocket.on("message", (message) => {
        const response = JSON.parse(message);
        if (response.msg_type === "authorize") {
            if (response.error) return io.to(loginid).emit("walletUpdate", { message: 'Authorization failed', error: response.error });
            derivSocket.send(JSON.stringify({ topup_virtual: 1, loginid }));
        }
    });

    derivSocket.on("error", (error) => io.to(loginid).emit("walletUpdate", { message: 'Top-up error', error }));
};

const handlePurchaseTrade = async (data) => {
    const { loginid, token } = data;
    const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);

    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
    derivSocket.on("message", (message) => {
        const response = JSON.parse(message);
        if (response.msg_type === "authorize") {
            if (response.error) return io.to(loginid).emit("purchaseConfirmation", { message: 'Authorization failed', error: response.error });
            const { token, ...proposalData } = data;
            derivSocket.send(JSON.stringify(proposalData));
        }
        if (response.msg_type === "proposal") {
            derivSocket.send(JSON.stringify({ buy: response.proposal.id, price: data.amount, subscribe: 1, loginid }));
            derivSocket.send(JSON.stringify({ proposal_open_contract: 1, contract_id: response.proposal.id, loginid }));
        }
        if (response.msg_type === 'proposal_open_contract') {
            io.to(loginid).emit("purchasedTradeStream", response);
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
    const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);

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

const handleProposalRequest = (data, socket) => {
    const { loginid, token, ...proposalRequest } = data;
    socket.join(loginid);
    const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);
    derivSocket.on("open", () => derivSocket.send(JSON.stringify(proposalRequest)));
    derivSocket.on("message", (data) => {
        const response = JSON.parse(data);
        if (response.msg_type === 'proposal' && response.proposal) {
            io.to(loginid).emit("proposalResponse", { type: response.echo_req.contract_type, data: response.proposal });
        }
    });
}
const handleSellTrade = (tradeData) => {
    const { token, ...tradeSellRequestData } = tradeData
    console.log('tradeSellRequestData', tradeData);

    const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);
    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
    derivSocket.on("message", (message) => {
        const response = JSON.parse(message);
        if (response.msg_type === "authorize") {
            derivSocket.send(JSON.stringify(tradeSellRequestData));
        }
        if (response.msg_type !== "authorize") {
            console.log(response);
        }
    });
}
const unsubscribeAssetData = (asset) => {
    if (assetConnections[asset]) {
        assetConnections[asset].close();
        delete assetConnections[asset];
        console.log(`Unsubscribed from live data for asset: ${asset}`);
    }
};

io.on('connection', (socket) => {
    socket.on("joinAssetRoom", (asset) => {
        socket.join(asset);
        console.log(`User ${socket.id} joined asset room: ${asset}`);
        fetchAssetData(asset, io);
    });

    socket.on("leaveAssetRoom", (asset) => {
        console.log(`User ${socket.id} left asset room: ${asset}`);
        socket.leave(asset);
        unsubscribeAssetData(asset);
    });

    socket.on("proposalRequest", (data) => handleProposalRequest(data, socket));
    socket.on("purchaseTrade", (tradeData) => handlePurchaseTrade(tradeData));
    socket.on("sellTrade", (tradeData) => handleSellTrade(tradeData));
    socket.on("fetchBalance", (userInfo) => handleWalletUpdate(userInfo, socket));
    socket.on("topUpWallet", (userInfo) => handleWalletTopUp(userInfo, socket));
    socket.on("transcationHistoryRequest", (data) => handleTranscationHistory(data, socket));
});

server.listen(5000, () => console.log('Server is listening on port 5000'));
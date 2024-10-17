const { DERIV_API_URL } = require("../config/constants");
const WebSocket = require("ws");
const DerivSocket = require("../services/derivSocket");

const assetConnections = {}; // Store active WebSocket connections by asset

// Function to dynamically generate proposal data based on the tick response
const createProposalData = (tick, contractType) => {
  return {
    proposal: 1,
    amount: 100, // Set amount based on the tick's bid price or fallback to 100
    barrier: "+0.1", // Adjust barrier dynamically
    basis: "stake",
    contract_type: contractType, // Use the provided contract type
    currency: "USD",
    duration: 60,
    duration_unit: "s",
    symbol: tick.symbol || 'RDBEAR', // Use the symbol from the tick, default to 'RDBEAR'
  };
};

const createWebSocketConnection = (asset, io, authToken) => {
  const ws = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);

  ws.on("open", () => {
    console.log(`Subscribed to live data for asset: ${asset}`);
console.log({authToken});

    // Authorize with token before sending any other requests
    ws.send(JSON.stringify({ authorize: authToken }));
  });

  ws.on("message", (data) => {
    const response = JSON.parse(data);

    if (response.error) {
      console.error('Authorization error:', response.error);
      return;
    }

    if (response.msg_type === "authorize" && response.authorize) {
      console.log("Authorization successful");
      
      // Subscribe to tick data after successful authorization
      ws.send(JSON.stringify({ ticks: asset }));
    }

    if (response.msg_type === 'tick' && response.tick) {
      io.to(asset).emit("assetData", response.tick);

      // Create proposal data for both CALL and PUT contracts
      const callProposalData = createProposalData(response.tick, "CALL");
      const putProposalData = createProposalData(response.tick, "PUT");

      // Send proposals for both CALL and PUT
      ws.send(JSON.stringify(callProposalData));
      ws.send(JSON.stringify(putProposalData));
    }

    // Handle other message types (e.g., proposal, transaction)
    if (response.msg_type === 'proposal') {
      if (response.proposal && response.echo_req.contract_type) {
        io.to(asset).emit("proposal", {
          type: response.echo_req.contract_type,
          data: response.proposal,
        });
      }
    }

    if (response.msg_type === 'transaction') {
      io.to(asset).emit("transactionUpdate", { message: 'Transaction occurred', data: response });
    }
  });

  ws.on("close", () => {
    console.log(`WebSocket closed for asset: ${asset}`);
    delete assetConnections[asset]; // Clean up connection
  });

  ws.on("error", (err) => {
    console.error(`WebSocket error for asset: ${asset}`, err);
    delete assetConnections[asset]; // Clean up on error
  });

  // Store the WebSocket connection for the asset
  assetConnections[asset] = ws;
};

// Function to unsubscribe from asset data
const unsubscribeAssetData = (asset) => {
  if (assetConnections[asset]) {
    assetConnections[asset].close();
    delete assetConnections[asset];
    console.log(`Unsubscribed from live data for asset: ${asset}`);
  }
};

// Handle socket connections from clients
const handleSocketConnection = (socket, io) => {
  console.log(`User connected: ${socket.id}`);

  // Join an asset room and establish WebSocket connection if not already connected
  socket.on("joinAssetRoom", (asset) => {
    socket.join(asset);
    console.log(`User ${socket.id} joined asset room: ${asset}`);

    // Only create WebSocket connection if it doesn't already exist
    if (!assetConnections[asset]) {
      createWebSocketConnection(asset, io);
    }
  });

  // Leave an asset room and close WebSocket if no users are left in the room
  socket.on("leaveAssetRoom", (asset) => {
    socket.leave(asset);
    console.log(`User ${socket.id} left asset room: ${asset}`);

    // Check if there are still users in the room
    const clientsInRoom = io.sockets.adapter.rooms.get(asset)?.size || 0;
    if (clientsInRoom === 0) {
      unsubscribeAssetData(asset); // Close WebSocket connection if room is empty
    }
  });

  socket.on("fetchBalance", async (userInfo) => {
    const { loginid, token } = userInfo;
    const derivSocket = new DerivSocket(token);
    await derivSocket.connect();

    // Join the user's room for balance updates
    socket.join(loginid);

    // Fetch the balance
    derivSocket.sendMessage({
      balance: 1,
      subscribe: 1,
      loginid
    });

    const response = await derivSocket.onMessage();
    io.to(loginid).emit("walletUpdate", response.balance); // Emit the updated balance

    // Leave the user's room after sending the balance update
    socket.leave(loginid);
  });

  // Handle wallet top-up
  socket.on("topUpWallet", async (userInfo) => {
    const { loginid, token } = userInfo;
    const derivSocket = new DerivSocket(token);
    await derivSocket.connect();

    // Join the user's room for wallet updates
    socket.join(loginid);

    derivSocket.sendMessage({
      topup_virtual: 1,
      loginid
    });

    await derivSocket.onMessage();

    derivSocket.sendMessage({
      balance: 1,
      subscribe: 1,
      loginid
    });

    const response = await derivSocket.onMessage();
    io.to(loginid).emit("walletUpdate", response.balance); // Emit the updated balance

    // Leave the user's room after sending the wallet update
    socket.leave(loginid);
  });

  socket.on("purchaseTrade", async (data) => {
    const { loginid, token } = data;
    socket.join(loginid);
    delete data.token; // Remove token for security

    const derivSocket = new DerivSocket(token);
    await derivSocket.connect();

    // Send the proposal message
    derivSocket.sendMessage(data);
    const proposalResponse = await derivSocket.onMessage();

    // Check if the response is a valid proposal
    if (proposalResponse.msg_type === 'proposal') {
      // Send the buy message using the proposal ID and price
      derivSocket.sendMessage({ buy: proposalResponse.proposal.id, price: data.amount });

      // Wait for the purchase response
      const purchaseResponse = await derivSocket.onMessage();

      // Check the purchase response for success or failure
      if (purchaseResponse.msg_type === 'buy') {
        if (purchaseResponse.buy) {
          // Purchase was successful, emit a confirmation
          io.to(loginid).emit("purchaseConfirmation", { message: 'Purchase successful', data: purchaseResponse });

          // Subscribe to contract updates for result tracking
          derivSocket.sendMessage({
            proposal_open_contract: 1,
            contract_id: purchaseResponse.buy.contract_id,
            subscribe: 1, // Subscribe to updates for this contract
          });

          // Wait for contract updates (win/loss status)
          derivSocket.onMessage(async (contractResponse) => {
            console.log({ contractResponse });

            if (contractResponse.msg_type === 'proposal_open_contract') {
              // This is where you receive the contract updates (win/loss result)
              const contract = contractResponse.proposal_open_contract;

              if (contract.status === 'won') {
                io.to(loginid).emit("transactionUpdate", { message: 'You won the trade!', data: contract });
                console.log(`User ${loginid} won the trade.`, contract);
              } else if (contract.status === 'lost') {
                io.to(loginid).emit("transactionUpdate", { message: 'You lost the trade.', data: contract });
                console.log(`User ${loginid} lost the trade.`, contract);
              }
            }
          });
        } else {
          io.to(loginid).emit("purchaseConfirmation", { message: 'Purchase failed', error: purchaseResponse.error });
        }
      }
    } else {
      io.to(loginid).emit("purchaseConfirmation", { message: 'Failed to retrieve proposal' });
    }

    socket.leave(loginid);
  });


  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};

module.exports = {
  handleSocketConnection,
};

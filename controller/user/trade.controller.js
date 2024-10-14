const { WebSocket } = require("ws");
const DerivSocket = require("../../services/derivSocket");

const getContractProposal = async (req, res) => {
    const { derivtoken } = req.headers;
    const derivSocket = new DerivSocket(derivtoken);
    try {
        await derivSocket.connect();
        derivSocket.sendMessage(req.body);

        const response = await derivSocket.onMessage();

        console.log("Response received:", response); // Log the response for debugging
        return res.status(200).send(response);
    } catch (error) {
        console.error("WebSocket error:", error);
        return res.status(400).send({ error: "WebSocket error: " + error.message });
    } finally {
        if (derivSocket.socket && derivSocket.socket.readyState === WebSocket.OPEN) {
            derivSocket.close(); // Close only if the socket is open
        }
        console.log("WebSocket connection closed.");
    }
}

let transactionSocket;

const startTransactionUpdatesSocket = async (derivtoken, loginid) => {
    transactionSocket = new DerivSocket(derivtoken);

    try {
        await transactionSocket.connect();

        // Subscribe to transaction updates
        const subscribeMessage = {
            transaction: 1,
            subscribe: 1,
            loginid: loginid // Use the actual login ID passed to the function
        };
        transactionSocket.sendMessage(subscribeMessage);

        transactionSocket.onMessage().then((response) => {
            // Handle incoming transaction update messages
            if (response.msg_type === 'transaction') {
                const transactionDetails = response.transaction;

                // Check if the transaction is a "buy" action (contract purchased)
                if (transactionDetails.action === 'buy') {
                    console.log('Contract Purchased:');
                    console.log('Amount:', transactionDetails.amount);
                    console.log('Contract ID:', transactionDetails.contract_id);
                    console.log('Purchase Time:', new Date(transactionDetails.transaction_time * 1000).toLocaleString());
                    console.log('Barrier:', transactionDetails.barrier || 'N/A');
                    console.log('Display Name:', transactionDetails.display_name);
                    console.log('Expiry Time:', new Date(transactionDetails.date_expiry * 1000).toLocaleString());
                    console.log('Current Balance:', transactionDetails.balance);

                    // Save the contract details for later reference (i.e., to compare after contract closes)
                    const purchasedContract = {
                        contract_id: transactionDetails.contract_id,
                        purchase_amount: transactionDetails.amount,
                        purchase_balance: transactionDetails.balance,
                    };

                    // Store this for comparison when "sell" happens
                    // You could save this in memory, database, or any storage if needed
                }

                // Check if the transaction is a "sell" action (contract closed)
                if (transactionDetails.action === 'sell') {
                    console.log('Contract Closed (Sold):');
                    console.log('Contract ID:', transactionDetails.contract_id);
                    console.log('Sell Amount:', transactionDetails.amount);
                    console.log('Sell Time:', new Date(transactionDetails.transaction_time * 1000).toLocaleString());
                    console.log('Current Balance:', transactionDetails.balance);

                    // Logic to check win/loss status:
                    // Assuming the contract_id matches a previously purchased contract
                    if (transactionDetails.contract_id === purchasedContract.contract_id) {
                        const balanceChange = transactionDetails.balance - purchasedContract.purchase_balance;

                        if (balanceChange > 0) {
                            console.log('🎉 You WON the contract!');
                            console.log('Profit:', balanceChange);
                        } else {
                            console.log('😞 You LOST the contract.');
                            console.log('Loss:', balanceChange);
                        }
                    } else {
                        console.log('This sell does not match any known purchased contracts.');
                    }
                }
            }
        });

    } catch (error) {
        console.error("Transaction WebSocket error:", error);
    }
};

const buyContractProposal = async (req, res) => {
    const { derivtoken } = req.headers;
    const derivSocket = new DerivSocket(derivtoken);

    try {
        const loginid = req.body.loginid;
        delete req.body.loginid;

        await derivSocket.connect();
        derivSocket.sendMessage(req.body);

        const response = await derivSocket.onMessage();
        console.log("Proposal response received:", response);

        if (response.msg_type === 'proposal') {
            const buyRequest = {
                buy: response.proposal.id,
                price: req.body.amount,
                loginid
            };
            derivSocket.sendMessage(buyRequest);
            const buyResponse = await derivSocket.onMessage();
            console.log("Buy response received:", buyResponse);

            // Start listening for transaction updates after the buy request is sent
            startTransactionUpdatesSocket(derivtoken, loginid); // No await here

            // Send response back to the client immediately
            return res.status(200).send(buyResponse);
        }
    } catch (error) {
        console.error("WebSocket error:", error);
        return res.status(400).send({ error: "WebSocket error: " + error.message });
    } finally {
        if (derivSocket.socket && derivSocket.socket.readyState === WebSocket.OPEN) {
            derivSocket.close(); // Close only if the socket is open
        }
        console.log("Buy contract WebSocket connection closed.");
    }
};

module.exports = {
    getContractProposal,
    buyContractProposal
}
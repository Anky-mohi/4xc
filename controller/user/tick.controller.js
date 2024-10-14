const { WebSocket } = require("ws");
const DerivSocket = require("../../services/derivSocket");

const getTickHistory = async (req, res) => {
    const { derivtoken } = req.headers;
    const derivSocket = new DerivSocket(derivtoken);
    try {
        if(!derivtoken){
            return res.status(400).json({message:'Token is missing'})
        }
        await derivSocket.connect();
        derivSocket.sendMessage(req.body);

        const response = await derivSocket.onMessage();
        console.log('bhjdsvbhks')
        return res.status(200).send(response);
    } catch (error) {
        return res.status(400).send({ error: "WebSocket error: " + error.message });
    } finally {
        if (derivSocket.socket && derivSocket.socket.readyState === WebSocket.OPEN) {
            derivSocket.close();
        }
    }
}

module.exports = {
    getTickHistory
}
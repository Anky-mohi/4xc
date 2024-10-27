const WebSocket = require("ws");
const DERIV_API_URL = "wss://ws.binaryws.com/websockets/v3";
const DERIV_APP_ID = 64508;
const jwt = require('../middlewares/jwt');

const getAllAssests = async (req, res) => {
    try {
        const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);
        derivSocket.on("open", () => derivSocket.send(JSON.stringify({ active_symbols: 'full', product_type: 'basic' })));
        derivSocket.once("message", async (data) => {
            const response = JSON.parse(data);
            if (response.msg_type === 'active_symbols') {
                return res.status(200).json({
                    status: 1,
                    message: 'Assets retrieved successfully',
                    data: response.active_symbols
                });
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: 'Internal Server Error',
            error: error?.message
        });
    }
}

const getTickHistory = async (req, res) => {
    try {
        const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);
        derivSocket.on("open", () => derivSocket.send(JSON.stringify(req.body)));
        derivSocket.once("message", async (data) => {
            const response = JSON.parse(data);
            return res.send(response)
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: 0 });
    }
}

const registerUser = async (req, res) => {
    try {
        const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);
        const { email } = req.body;
        const token = jwt.generateToken(req.body, "24h");
        derivSocket.on("open", () => derivSocket.send(JSON.stringify({
            verify_email: email,
            type: "account_opening",
        })));

        derivSocket.once("message", (data) => {
            const response = JSON.parse(data);
            if (!res.headersSent) {
                if (response.error) {
                    return res.status(500).json({ message: response.error.message, status: 0 });
                }
                return res.json({
                    token: token,
                    message: "Email verification sent successfully!",
                    status: 1,
                });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: 0 });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);
        const { code, username } = req.body;
        const token = await jwt.verifyToken(req);
        if (!token.isVerified) return res.status(500).json({ msg: "Token expired" });
        token.data.code = code;
        token.data.username = username;
        derivSocket.once("open", () => derivSocket.send(JSON.stringify({
            new_account_virtual: 1,
            type: "trading",
            client_password: token.data.password,
            residence: "in",
            verification_code: code,
        })));

        derivSocket.once("message", (data) => {
            const response = JSON.parse(data);

            if (!res.headersSent) {
                if (response.error) {
                    return res.status(500).json({ message: response.error.message, status: 0 });
                }
                return res.json({ message: "Virtual account created successfully!", status: 1 });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: 0 });
    }
}

const login = async (req, res) => {
    try {
        const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);
        const { token } = req.body
        derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: token })));
        derivSocket.once("message", async (data) => {
            const response = JSON.parse(data);
            if (response.error) {
                return res.status(500).json({ message: response.error.message, status: 0 });
            }
            if (response.msg_type === "authorize") {

                const userData = {
                    loginid: response.authorize.loginid,
                    balance: response.authorize.balance,
                    email: response.authorize.email,
                    fullname: response.authorize.fullname,
                    is_virtual: response.authorize.is_virtual,
                    currency: response.authorize.currency,
                    country: response.authorize.country,
                    preferred_language: response.authorize.preferred_language,
                    user_id: response.authorize.user_id,
                    account_list: response.authorize.account_list,
                    deriv_token: token
                };
                return res.json({ data: userData, token, message: "Virtual account login successful!", status: 1 });
            }
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: 0 });
    }

}

const deposit = async (req, res) => {
    const derivSocket = new WebSocket(`${DERIV_API_URL}?app_id=${DERIV_APP_ID}`);

    derivSocket.on("open", () => derivSocket.send(JSON.stringify({ authorize: 'a1-Pxi7YbqinAvLxOHVmi8eYuppEWkB6' })));
    derivSocket.on("message", (message) => {
        const response = JSON.parse(message);
        const cashierRequest = {
            cashier: "deposit",
            provider: "doughflow",
            loginid: "CR7878680"
        }
        if (response.msg_type === "authorize") {
            derivSocket.send(JSON.stringify(cashierRequest));
        }
        console.log(response);

        // if (response.msg_type === 'profit_table') {
        //     io.to(data.loginid).emit("transcationHistory", response);
        // }
    });
}
module.exports = {
    getAllAssests,
    getTickHistory,
    registerUser,
    verifyOtp,
    login,
    deposit
}
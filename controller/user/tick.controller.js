const { getResponseFromDeriv } = require("./deriv.controller");

const getTickHistory = async (req, res) => {
    try {
        const derivResponse = await getResponseFromDeriv(req.body);
        return res.status(200).send(derivResponse)
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

module.exports = {
    getTickHistory
}
require("dotenv").config();

module.exports = {
    APP_ID: process.env.APP_ID,
    DERIV_API_URL: process.env.DERIV_API_URL,
    PORT: process.env.PORT || 5000,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "Licotex_secret",
    SESSION_SECRET: process.env.SESSION_SECRET || 'default_session_secret',
    DERIV_API_URL: process.env.DERIV_API_URL || '',
    DERIV_API_TOKEN: process.env.DERIV_API_TOKEN || '',
    DERIV_APP_ID: process.env.DERIV_APP_ID || '',
    DERIV_ADMIN_LOGIN_ID: process.env.DERIV_ADMIN_LOGIN_ID || '',
    DERIV_WS_URL: process.env.DERIV_WS_URL,
    MONGO_URI: process.env.MONGO_URI
}
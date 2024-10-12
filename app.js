const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

// Middleware Imports
const { globalErrHandler, notFoundErr } = require("./middlwares/globalErrHandler");
const multipart = require("./middlwares/multer.middlware");
const { urlEncoded, jsonEncoded } = require("./middlwares/bodyParser.middlware");
const cors = require("./middlwares/cors.middlware");
const indexRoute = require("./routes/index.routes");
const { SESSION_SECRET } = require("./config/constants");

// Configuration Files
require("./config/passport");
require("./middlwares/websocket.middlware");
// require("./cron"); // Uncomment if using cron jobs

const app = express();

// Predefined Middlewares
app.use(cors()); // Handles CORS
app.use(urlEncoded); // Body parsing middleware (URL-encoded)
app.use(jsonEncoded); // Body parsing middleware (JSON)
app.use(multipart); // Handles file uploads

// Session Configuration
app.use(
  session({
    secret: SESSION_SECRET || "default_session_secret", // Use session secret from constants
    resave: false, // Avoid resaving session if not modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { secure: process.env.NODE_ENV === "production" }, // Secure cookies for production (HTTPS)
  })
);

// Passport.js initialization
app.use(passport.initialize());
app.use(passport.session());

// Static file serving
app.use("/storage/images", express.static(path.join(__dirname, "storage/images")));

// API Routes
app.use("/api", indexRoute);

// Error Handling Middlewares
app.use(notFoundErr); // 404 handling middleware
app.use(globalErrHandler); // Global error handler

module.exports = app;

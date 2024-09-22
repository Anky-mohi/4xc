const express = require("express");
const app = express();
const {
    globalErrHandler,
    notFoundErr,
} = require("../middlwares/globalErrHandler");
const multipart = require('../middlwares/multer.middlware');
const { urlEncoded, jsonEncoded } = require('../middlwares/bodyParser.middlware');
const cors = require('../middlwares/cors.middlware');
const path = require("path");
const indexRoute = require("../routes/index.routes");
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('../config/passport');  

// predefined middlware
app.use(cors());
app.use(urlEncoded);
app.use(jsonEncoded);
app.use(multipart);


// Set up session (required for Passport.js)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());


// server.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use('/storage/images',express.static(path.join(__dirname, 'storage/images')));

app.use("/api",indexRoute);

app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;
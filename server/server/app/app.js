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
const { errors } = require("celebrate")
const indexRoute = require("../routes/index.routes");

// here all routes file
// const userRoutes = require("../routes/user.routes");
// const taskRoutes = require("../routes/task.routes");

// predefined middlware
app.use(cors());
app.use(urlEncoded);
app.use(jsonEncoded);
app.use(multipart);
// server.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use('/storage/images',express.static(path.join(__dirname, 'storage/images')));

// routes middlware
app.use("/api",indexRoute);
// app.use("/api/task",taskRoutes);

// app.use(errors());
app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;
require("dotenv").config();
const http = require("http");
require("./config/dbConnect");
require("./config/derivSocket");
const app = require("./app/app");
const PORT = process.env.PORT || 3800;

const server = http.createServer(app);
server.listen(PORT, console.log(`Server is running on port ${PORT}`));
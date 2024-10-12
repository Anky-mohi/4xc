const http = require("http");
const socketIO = require("socket.io");
const { PORT } = require("./config/constants");
const app = require("./app");
const connectDB = require('./config/dbConnect');
const { handleSocketConnection } = require("./sockets/socketHandlers");

const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketIO(server, {
  cors: {
    origin: "*",  // Replace with actual client URL in production
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle socket connections
io.on("connection", (socket) => handleSocketConnection(socket, io));

// Connect to MongoDB first, then start the server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
const socketIO = require('socket.io');
const roomManager = require('./rooms.middlware'); // Import the room manager

module.exports = (server) => {
  const io = socketIO(server);

  // Initialize the room manager with io object
  roomManager(io);
};

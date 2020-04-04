const app = require("express")();
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

server.listen(PORT);
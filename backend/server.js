const express = require("express");
const http = require("http");
const socket = require("socket.io");
// import axios from "axios";
// const router = require("./routes");

const PORT = 3000;

const app = express();
// app.use(router);

const server = http.createServer(app);
const io = socket(server);


io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
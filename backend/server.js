import express from "express";
import { createServer } from "http";
import socket from "socket.io";
// import axios from "axios";
import router from "./routes";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(router);

const server = createServer(app);
const io = socket(server);


io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

server.listen(PORT, () => console.log(`Listening on post ${PORT}`));
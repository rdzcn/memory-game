const express = require("express");
const http = require("http");
const socket = require("socket.io");
// import axios from "axios";
const router = require("./routes");

const PORT = 3001;

const app = express();
app.use(router);

const httpServer = http.createServer(app);
const io = socket(httpServer);


io.on('connect', socket => {
  console.log(`Client is connected to ${socket.id}`);
  socket.emit("message", { welcome: "Welcome" });

  socket.on('disconnect', () => {
    console.log(`Client is disconnected from ${socket.id}`);
  });
});

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware";
import GamesController from "./controllers/games.controller";
import { GameEventHandler } from "./server/game-event-handler";

const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(errorHandler);
dotenv.config();

const server = createServer(app);

const io = new SocketIOServer(server, {
	path: "/socket.io",
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const gamesController = new GamesController();
const gameEventHandler = new GameEventHandler(io, gamesController);

// Track active connections
// Not accuracte currently as it registeres the same user twice when the page refreshes
// It should be fixed in the future
let onlineUsers = 0;

// WebSocket connection
io.on("connection", (socket) => {
	console.log("User connected", socket.id);
	onlineUsers++;
	console.log("Number of online users:", onlineUsers);
	gameEventHandler.handleConnection(socket);
	io.emit("user-count", { count: onlineUsers });

	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
		onlineUsers--;
		console.log("Number of online users:", onlineUsers);
		io.emit("user-count", { count: onlineUsers });
	});

	socket.on("error", (err) => {
		console.error("Socket error:", err);
	});
});

// Routes
app.get("/", (req, res) => {
	res.send("Hello, Express!");
});

server.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

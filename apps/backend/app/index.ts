import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware";
import GamesController from "./controllers/games.controller";
import { GameEventHandler } from "./server/game-event-handler";

const PORT = 4040;

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

// WebSocket connection
io.on("connection", (socket) => {
	console.log("User connected", socket.id);
	gameEventHandler.handleConnection(socket);

	socket.on("error", (err) => {
		console.error("Socket error:", err);
	});
});

// Routes
app.get("/", (req, res) => {
	res.send("Hello, Express!");
});

server.listen(PORT, "0.0.0.0", () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

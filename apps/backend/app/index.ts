import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import { errorHandler } from "./middleware";
import GamesController from "./controllers/games.controller";
import { GameEventHandler } from "./server/game-event-handler";

// const HEARTBEAT_INTERVAL = 5000;
// const PLAYER_TIMEOUT = 10000;
const PORT = 4040;

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(errorHandler);

const server = createServer(app);

const io = new SocketIOServer(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const gamesController = new GamesController();
const gameEventHandler = new GameEventHandler(io, gamesController);

// WebSocket connection
io.on("connection", (socket) => {
	console.log("🚀 A user connected", socket.id);

	gameEventHandler.handleConnection(socket);

	socket.on("error", (err) => {
		console.error("Socket error:", err);
	});
});

// Routes
app.get("/", (req, res) => {
	res.send("Hello, Express!");
});

app.get("/games", (req, res) => {
	gamesController.getAllGames(req, res);
});

app.get("/games/:id", (req, res) => {
	gamesController.getGameById(req, res);
});

server.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

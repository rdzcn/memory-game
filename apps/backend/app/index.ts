import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import { errorHandler } from "./middleware";
import GamesController from "./controllers/games-controller";
import { GameEventHandler } from "./server/game-event-handler";

const PORT = process.env.PORT || 4102;

const ALLOWED_ORIGINS =
	process.env.NODE_ENV === "development"
		? ["http://localhost:3000"]
		: ["https://memorygame.ardinho.com", "https://api.ardinho.com"];

const app = express();

// ── Global middleware ─────────────────────────────────────
app.use(express.json());
app.use(
	cors({
		origin: ALLOWED_ORIGINS,
	})
);
app.use(errorHandler);

// ── Sub-router for /memory-game ─────────────────────────────
const apiRouter = express.Router();

// Serve static files under /memory-game
apiRouter.use(express.static("public"));

// Health and debug routes
apiRouter.get("/", (req, res) => {
	res.send("✅ Memory Game API is running under /memory-game");
});

apiRouter.get("/health", (req, res) => {
	// TODO: Add actual health check logic here (database, etc.)
	res.status(200).json({ status: "ok" });
});

apiRouter.get("/debug", (req, res) => {
	res.json({
		headers: req.headers,
		origin: req.get("origin"),
		baseUrl: req.baseUrl,
		url: req.url,
		cors: "ok",
	});
});

// Mount the router at /memory-game
app.use("/memory-game", apiRouter);

// ── Socket.IO Setup ───────────────────────────────────────
const server = createServer(app);

const io = new SocketIOServer(server, {
	path: "/socket.io",
	cors: {
		origin: ALLOWED_ORIGINS,
		methods: ["GET", "POST"],
	},
});

const gamesController = new GamesController();
const gameEventHandler = new GameEventHandler(io, gamesController);

// Track active connections
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

// ── Start server ──────────────────────────────────────────
server.listen(PORT, () => {
	console.log(`🚀 Memory Game Server is running on port ${PORT}`);
	console.log(`   → API available at http://localhost:${PORT}/memory-game`);
});
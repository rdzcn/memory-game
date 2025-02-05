import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import { errorHandler } from "./middleware";
import GamesController from "./controllers/games.controller";

const PORT = 4040;

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(errorHandler);

const server = createServer(app);

const io = new SocketIOServer(server);

// WebSocket connection
io.on("connection", (socket) => {
	console.log("✅ A user connected", socket.id);

	socket.on("disconnect", () => {
		console.log("❌ A user disconnected", socket.id);
	});

	socket.on("error", (err) => {
		console.error("Socket error:", err);
	});
});

const gamesController = new GamesController(io);

// Routes
app.get("/", (req, res) => {
	res.send("Hello, Express!");
});
app.get("/games", gamesController.getGames);
app.post("/games/create", async (req, res) => {
	try {
		await gamesController.createGame(req, res);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

server.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

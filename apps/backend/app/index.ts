import express from "express";
import { Server } from "socket.io";
import http from "node:http";
import cors from "cors";
import { errorHandler } from "./middleware";
import GamesController from "./controllers/games.controller";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

app.use(cors());
const PORT = 4040;

app.use(express.json());

// WebSocket connection
io.on("connection", (socket) => {
	console.log("✅ A user connected", socket.id);

	socket.on("disconnect", () => {
		console.log("❌ A user disconnected", socket.id);
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

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

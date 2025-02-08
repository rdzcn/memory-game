import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import { errorHandler } from "./middleware";
import GamesController, {
	readGames,
	writeGames,
} from "./controllers/games.controller";
import type { Game } from "@common/types/game.types";

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

// WebSocket connection
io.on("connection", (socket) => {
	socket.on("leaveGame", ({ gameId, playerId }) => {
		const games = readGames();
		const gameIndex = games.findIndex((g) => g.gameId === gameId);

		if (gameIndex !== -1) {
			// Create a new updated game object
			const updatedGame = {
				...games[gameIndex],
				players: games[gameIndex].players.filter((p) => p.id !== playerId),
			};

			let updatedGames: Game[];
			if (updatedGame.players.length === 0) {
				// Remove the game if no players left
				updatedGames = games.filter((g) => g.gameId !== gameId);
			} else {
				// Otherwise, replace the modified game in the array
				updatedGames = [...games];
				updatedGames[gameIndex] = updatedGame;
			}

			writeGames(updatedGames);
			io.emit("gameUpdated", updatedGame);
		}
	});

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
app.post("/games/join", async (req, res) => {
	try {
		await gamesController.joinGame(req, res);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});
app.get("/games/:gameId", async (req, res) => {
	try {
		await gamesController.getGameById(req, res);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

server.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware";
import { GamesController } from "./controllers/games.controller";

const app = express();
app.use(cors());
const PORT = 4040;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.send("Hello, Express!");
});
app.get("/games", GamesController.getGames);
// app.post("/games/create", GamesController.createGame);

app.post("/games/create", async (req, res) => {
	try {
		await GamesController.createGame(req, res);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

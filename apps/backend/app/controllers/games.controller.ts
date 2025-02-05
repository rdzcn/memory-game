import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import type { Game } from "../../../../packages/common/types/game.types";
import type { Server } from "socket.io";

const GAMES_FILE = path.resolve(__dirname, "../../data/games.json");

const readGames = (): Game[] => {
	if (!fs.existsSync(GAMES_FILE)) return [];
	return JSON.parse(fs.readFileSync(GAMES_FILE, "utf8"));
};

const writeGames = (games: Game[]) => {
	fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
};

class GamesController {
	private io: Server;

	constructor(io: Server) {
		this.io = io;
	}

	async createGame(req: Request, res: Response) {
		try {
			const { gameTitle, username } = req.body;

			const newGame = {
				gameId: crypto.randomUUID(),
				gameTitle,
				players: [{ id: crypto.randomUUID(), name: username, score: 0 }],
			};

			// Save game data to file
			const games = readGames();
			games.push(newGame);
			writeGames(games);

			// Emit event to update all clients
			this.io.emit("gameCreated", newGame);

			res.status(201).json(newGame);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async getGames(_req: Request, res: Response) {
		try {
			const games = readGames();
			res.json(games);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}

export default GamesController;

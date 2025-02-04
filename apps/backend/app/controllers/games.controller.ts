import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import type { Game } from "../../../../packages/common/types/game.types";

const GAMES_FILE = path.resolve(__dirname, "../../data/games.json");

const readGames = (): Game[] => {
	if (!fs.existsSync(GAMES_FILE)) return [];
	return JSON.parse(fs.readFileSync(GAMES_FILE, "utf8"));
};

const writeGames = (games: Game[]) => {
	fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
};

const createGame = async (req: Request, res: Response) => {
	try {
		const { username } = req.body;
		if (!username) {
			return res.status(400).json({ error: "Username is required" });
		}

		const games = readGames();
		const gameId = uuidv4();

		const newGame = {
			gameId,
			players: [{ id: uuidv4(), name: username, score: 0 }],
		};

		games.push(newGame);
		writeGames(games);

		res.json({ gameId });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getGames = async (_req: Request, res: Response) => {
	try {
		const games = readGames();
		res.json(games);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const GamesController = {
	createGame,
	getGames,
};

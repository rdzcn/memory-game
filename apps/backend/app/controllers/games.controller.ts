import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import type { GameState } from "@common/types/game.types";
import { Game } from "../game";

const GAMES_FILE = path.resolve(__dirname, "../../data/games.json");

export const readGames = (): Record<string, GameState> => {
	if (!fs.existsSync(GAMES_FILE)) return {};
	return JSON.parse(fs.readFileSync(GAMES_FILE, "utf8"));
};

export const writeGames = (games: Record<string, GameState>) => {
	fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 4));
};

class GamesController {
	private games: Map<string, GameState> = new Map();

	constructor() {
		this.games = new Map(Object.entries(readGames()));
	}

	createGame({ gameTitle, username }: { gameTitle: string; username: string }) {
		const playerId = crypto.randomUUID();
		const newGame = new Game(gameTitle);

		const player = {
			id: playerId,
			name: username,
			socketId: "",
			score: 0,
		};

		newGame.addPlayer(player);
		const gameId = newGame.getId();
		const gameData = { ...newGame.getState(), title: gameTitle };
		this.games.set(gameId, gameData);

		// Save game data to file
		const games = readGames();
		games[gameId] = gameData;
		writeGames(games);

		return newGame.getState();
	}

	joinGame({ gameId, username }: { gameId: string; username: string }) {
		const game = this.games.get(gameId);
		const playerId = crypto.randomUUID();
		const player = {
			id: playerId,
			name: username,
			socketId: "",
			score: 0,
		};

		if (!game) {
			throw new Error("Game not found");
		}
		game.players.push(player);
		this.games.set(gameId, game);
		writeGames(Object.fromEntries(this.games));

		return { playerId, game };
	}

	getInMemoryGames() {
		return Array.from(this.games.values());
	}

	getGame(gameId: string): GameState | undefined {
		return this.games.get(gameId);
	}

	leaveGame({ gameId, playerId }: { gameId: string; playerId: string }) {
		const game = this.games.get(gameId);
		if (!game) {
			return null;
		}

		const remainingPlayer = game.players.filter((p) => p.id !== playerId);
		const updatedGame = { ...game, players: remainingPlayer };

		if (remainingPlayer.length === 0) {
			this.games.delete(gameId);
			writeGames(Object.fromEntries(this.games));
			return null;
		}

		this.games.set(gameId, updatedGame);
		writeGames(Object.fromEntries(this.games));
		return updatedGame;
	}

	// express handlers
	async getAllGames(_req: Request, res: Response): Promise<void> {
		try {
			const games = Array.from(this.games.values());
			res.json(games);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async getGameById(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const game = this.getGame(id);

		if (!game) {
			res.status(404).json({ message: "Game not found" });
			return;
		}

		res.json(game);
	}
}

export default GamesController;

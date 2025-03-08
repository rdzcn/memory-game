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
	private games: Map<string, Game> = new Map();

	constructor() {
		// Convert saved game states back to Game instances
		const savedGames = readGames();
		for (const [gameId, gameState] of Object.entries(savedGames)) {
			const game = new Game(gameState.title, true);

			console.log("CONSTRUCTIR", game);

			// Restore the game state
			game.restoreState(gameState);
			this.games.set(gameId, game);
		}
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

		// Store the Game instance
		this.games.set(gameId, newGame);

		// Save game state to file
		const games = readGames();
		games[gameId] = newGame.getState();
		writeGames(games);

		return newGame.getState();
	}

	joinGame({ gameId, username }: { gameId: string; username: string }) {
		const game = this.games.get(gameId);
		if (!game) {
			throw new Error("Game not found");
		}

		// Now you have access to all Game instance methods
		const playerId = crypto.randomUUID();
		const player = {
			id: playerId,
			name: username,
			socketId: "",
			score: 0,
		};

		game.addPlayer(player);

		// Save updated state
		const games = readGames();
		games[gameId] = game.getState();
		writeGames(games);

		return { playerId, game: game.getState() };
	}

	getInMemoryGames() {
		return Array.from(this.games.values());
	}

	getGame(gameId: string): Game | undefined {
		return this.games.get(gameId);
	}

	leaveGame({ gameId, playerId }: { gameId: string; playerId: string }) {
		const game = this.games.get(gameId);
		if (!game) {
			return null;
		}

		// Use the Game instance method to remove player
		game.removePlayer(playerId);

		// If no players left, remove the game
		if (game.getState().players.length === 0) {
			this.games.delete(gameId);
			this.saveGames();
			return null;
		}

		// Save the updated state
		const games = readGames();
		games[gameId] = game.getState();
		writeGames(games);

		return game.getState();
	}

	startGame({ gameId }: { gameId: string }) {
		const game = this.games.get(gameId);

		if (!game) {
			return null;
		}

		// Update the game status through state restoration
		const currentState = game.getState();
		game.restoreState({
			...currentState,
			status: "playing",
		});

		// Save the updated state
		const games = readGames();
		games[gameId] = game.getState();
		writeGames(games);

		return game.getState();
	}

	private saveGames() {
		const gameStates = Object.fromEntries(
			Array.from(this.games.entries()).map(([id, game]) => [
				id,
				game.getState(),
			]),
		);
		writeGames(gameStates);
	}

	flipCard({
		gameId,
		id,
		playerId,
	}: { gameId: string; id: number; playerId: string }) {
		const game = this.games.get(gameId);

		if (!game) {
			return null;
		}

		const isFlipped = game.flipCard({ id, playerId });

		if (isFlipped) {
			// Save the updated state
			const games = readGames();
			games[gameId] = game.getState();
			writeGames(games);
		}

		return game.getState();
	}

	switchTurn({ gameId }: { gameId: string }) {
		const game = this.games.get(gameId);

		if (!game) {
			return null;
		}

		game.switchTurn();
		const games = readGames();
		games[gameId] = game.getState();
		writeGames(games);
		return game.getState();
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

		// Reload games from JSON
		const savedGames = readGames();
		if (savedGames[id]) {
			const game = new Game(savedGames[id].title, true);
			this.games.set(id, game);
			game.restoreState(savedGames[id]);
		}

		const game = this.getGame(id);
		if (!game) {
			res.status(404).json({ message: "Game not found" });
			return;
		}

		res.json(game);
	}
}

export default GamesController;

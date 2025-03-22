import fs from "node:fs";
import path from "node:path";
import { Game } from "../game";
import type { GameState } from "../types/game.types";

const GAMES_FILE = path.resolve(__dirname, "../data/games.json");

export const readGames = (): Record<string, GameState> => {
	try {
		if (!fs.existsSync(GAMES_FILE)) return {};
		const data = fs.readFileSync(GAMES_FILE, "utf8");
		return data ? JSON.parse(data) : {};
	} catch (error) {
		console.error("Error reading games file:", error);
		return {};
	}
};

export const writeGames = (games: Record<string, GameState>) => {
	try {
		fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 4));
		console.log("Game successfully saved.");
	} catch (error) {
		console.error("Error writing to file:", error);
	}
};

class GamesController {
	private games: Map<string, Game> = new Map();

	constructor() {
		// Convert saved game states back to Game instances
		const savedGames = readGames();
		for (const [gameId, gameState] of Object.entries(savedGames)) {
			const game = new Game(gameState.title, true);

			// Restore the game state
			game.restoreState(gameState);
			this.games.set(gameId, game);
		}
	}

	createGame({
		gameTitle,
		username,
		socketId,
	}: { gameTitle: string; username: string; socketId: string }) {
		const playerId = crypto.randomUUID();
		const newGame = new Game(gameTitle);

		const player = {
			id: playerId,
			name: username,
			socketId,
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

	joinGame({
		gameId,
		username,
		socketId,
	}: { gameId: string; username: string; socketId: string }) {
		const game = this.games.get(gameId);
		if (!game) {
			throw new Error("Game not found");
		}

		// Now you have access to all Game instance methods
		const playerId = crypto.randomUUID();
		const player = {
			id: playerId,
			name: username,
			socketId,
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

		game.removePlayer(playerId);

		if (game.getState().players.length === 0) {
			// Only remove if game is NOT finished
			if (game.getState().status !== "finished") {
				this.games.delete(gameId);
			}
			this.saveGames();
			return null;
		}

		this.saveGames();
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
		const existingGames = readGames();

		const gameStates = {
			...existingGames,
			...Object.fromEntries(
				Array.from(this.games.entries()).map(([id, game]) => [
					id,
					game.getState(),
				]),
			),
		};

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
}

export default GamesController;

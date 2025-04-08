import RedisClient from "./redis-client";

interface GameData {
	id: string;
	players: string[];
	status: string;
	createdAt?: number;
	// Add other game-specific fields
}

// Instead of a class, we'll use an object with functions
const GameRepository = {
	GAMES_HASH_KEY: "memory-game:games",

	async saveGame(game: GameData) {
		try {
			const redisClient = await RedisClient.getInstance();

			await redisClient.hSet(
				this.GAMES_HASH_KEY,
				game.id,
				JSON.stringify(game),
			);
		} catch (error) {
			console.error("Error saving game", error);
			throw error;
		}
	},

	async getGame(gameId: string): Promise<GameData | null> {
		try {
			const redisClient = await RedisClient.getInstance();

			const gameJson = await redisClient.hGet(this.GAMES_HASH_KEY, gameId);

			return gameJson ? JSON.parse(gameJson) : null;
		} catch (error) {
			console.error("Error retrieving game", error);
			return null;
		}
	},

	async deleteGame(gameId: string) {
		const redisClient = await RedisClient.getInstance();

		await redisClient.hDel(this.GAMES_HASH_KEY, gameId);
	},

	async getAllGames(): Promise<GameData[]> {
		const redisClient = await RedisClient.getInstance();

		const games = await redisClient.hGetAll(this.GAMES_HASH_KEY);

		return Object.values(games)
			.map((gameJson) => {
				try {
					return JSON.parse(gameJson);
				} catch {
					return null;
				}
			})
			.filter((game): game is GameData => game !== null);
	},

	async updateMultipleGames(updates: Record<string, Partial<GameData>>) {
		const redisClient = await RedisClient.getInstance();

		const multi = redisClient.multi();

		for (const [gameId, startedAt] of Object.entries(updates)) {
			const existingGameJson: string | null | undefined =
				await redisClient.hGet(this.GAMES_HASH_KEY, gameId);
			if (existingGameJson) {
				const existingGame = JSON.parse(existingGameJson);
				const updatedGame = { ...existingGame, ...startedAt };
				multi.hSet(this.GAMES_HASH_KEY, gameId, JSON.stringify(updatedGame));
			}
		}

		await multi.exec();
	},

	async setGameExpiration(gameId: string, seconds: number) {
		const redisClient = await RedisClient.getInstance();

		await redisClient.expire(`${this.GAMES_HASH_KEY}:${gameId}`, seconds);
	},

	async cleanupOldGames(maxAgeHours = 24) {
		const redisClient = await RedisClient.getInstance();

		const games = await this.getAllGames();
		const cutoffTime = Date.now() - maxAgeHours * 60 * 60 * 1000;

		const gamesToDelete = games
			.filter((game) => !game.createdAt || game.createdAt < cutoffTime)
			.map((game) => game.id);

		if (gamesToDelete.length > 0) {
			const multi = redisClient.multi();
			for (const gameId of gamesToDelete) {
				multi.hDel(this.GAMES_HASH_KEY, gameId);
			}
			await multi.exec();
		}
	},
};

export default GameRepository;

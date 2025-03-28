import { createClient, type RedisClientType } from "redis";

class RedisClient {
	private static _instance: RedisClientType | null = null;
	private static _connectAttempts = 0;
	private static readonly MAX_CONNECT_ATTEMPTS = 3;

	private constructor() {}

	public static async getInstance() {
		if (!RedisClient._instance) {
			try {
				RedisClient._instance = createClient({
					url: process.env.REDIS_URL || "redis://localhost:6379",
					socket: {
						connectTimeout: 5000, // 5 second timeout
						// disconnectTimeout: 5000,
					},
				});

				RedisClient._instance.on("error", (err) => {
					console.error("Redis Client Error", err);

					// Attempt reconnection
					if (RedisClient._connectAttempts < RedisClient.MAX_CONNECT_ATTEMPTS) {
						RedisClient._connectAttempts++;
						setTimeout(
							() => RedisClient.getInstance(),
							1000 * RedisClient._connectAttempts,
						);
					}
				});

				RedisClient._instance.on("connect", () => {
					console.log("Redis connected successfully");
					RedisClient._connectAttempts = 0; // Reset attempts on successful connection
				});

				await RedisClient._instance.connect();
			} catch (error) {
				console.error("Failed to connect to Redis", error);
				RedisClient._instance = null;
				throw error;
			}
		}

		return RedisClient._instance;
	}

	public static async closeConnection() {
		if (RedisClient._instance) {
			try {
				await RedisClient._instance.quit();
			} catch (error) {
				console.error("Error closing Redis connection", error);
			} finally {
				RedisClient._instance = null;
			}
		}
	}

	// Optional: Add ping method to check connection
	public static async ping() {
		try {
			const client = await RedisClient.getInstance();
			await client.ping();
			return true;
		} catch {
			return false;
		}
	}
}

export default RedisClient;

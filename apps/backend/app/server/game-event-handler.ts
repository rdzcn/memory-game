import type { Server, Socket } from "socket.io";
import type GamesController from "../controllers/games.controller";
import { HeartbeatManager } from "./heartbeat";
import { getHighestScoreGame } from "@memory-game/database";

export class GameEventHandler {
	private heartbeatManager: HeartbeatManager;

	constructor(
		private io: Server,
		private gameController: GamesController,
	) {
		this.heartbeatManager = new HeartbeatManager(this);
	}

	handleConnection(socket: Socket): void {
		socket.on("get-games", () => this.handleGetGames());
		socket.on("create-game", (data) => this.handleCreateGame(socket, data));
		socket.on("join-game", (data) => this.handleJoinGame(socket, data));
		socket.on("leave-game", (data) => this.handleLeaveGame(socket, data));
		socket.on("register-socket", (data) =>
			this.handleRegisterSocket(socket, data),
		);
		socket.on("unregister-socket", (data) =>
			this.handleUnregisterSocket(socket, data),
		);
		socket.on("heartbeat", (data) => this.handleHeartbeat(socket, data));
		socket.on("start-game", (data) => this.handleStartGame(socket, data));
		socket.on("flip-card", (data) => this.handleFlipCard(data));
		socket.on("switch-turn", (data) => this.handleSwitchTurn(data));
		socket.on("watch-game", (data) => this.handleWatchGame(socket, data));
		socket.on("get-highest-score-game", () => this.handleGetHighestScoreGame());
		socket.on("disconnect", () => this.handleDisconnect(socket));
		socket.on("request-game-state", ({ gameId }) => {
			const game = this.gameController.getGame(gameId);
			if (game) {
				socket.emit("game-state", game.getState());
			}
		});
	}

	handleGetGames(): void {
		const games = this.gameController.getInMemoryGames();
		this.io.emit("games", games);
	}

	handleCreateGame(
		socket: Socket,
		{
			username,
			gameTitle,
			cardCount = 12,
		}: { username: string; gameTitle: string; cardCount?: number },
	): void {
		const socketId = socket.id;
		const game = this.gameController.createGame({
			username,
			gameTitle,
			socketId,
			cardCount,
		});

		const player = game.players[0];

		socket.join(game.id);
		this.heartbeatManager.registerSocket(socket, game.id, player.id);

		const games = this.gameController.getInMemoryGames();
		this.io.emit("games", games);

		this.io.emit("game-created", game);
	}

	handleJoinGame(
		socket: Socket,
		{ gameId, username }: { gameId: string; username: string },
	): void {
		const { playerId, game } = this.gameController.joinGame({
			gameId,
			username,
			socketId: socket.id,
		});

		if (!game) {
			socket.emit("game-not-found");
			return;
		}

		socket.join(gameId);
		this.heartbeatManager.registerSocket(socket, gameId, playerId);

		const games = this.gameController.getInMemoryGames();
		this.io.emit("games", games);

		this.io.to(gameId).emit("player-joined", playerId);
		this.io.to(gameId).emit("game-updated", game);
	}

	handleLeaveGame(
		socket: Socket,
		{ gameId, playerId }: { gameId: string; playerId: string },
	): void {
		const game = this.gameController.leaveGame({ gameId, playerId });
		socket.leave(gameId);

		this.io.to(gameId).emit("player-left", playerId);
		this.io.to(gameId).emit("game-updated", game);
	}

	handleStartGame(socket: Socket, { gameId }: { gameId: string }): void {
		const game = this.gameController.startGame({ gameId });

		this.io.to(gameId).emit("game-updated", game);
	}

	async handleFlipCard({
		gameId,
		playerId,
		id,
	}: { gameId: string; id: number; playerId: string }): Promise<void> {
		const gameState = this.gameController.flipCard({
			gameId,
			id,
			playerId,
		});

		if (gameState?.status === "finished") {
			const highestScoreGame = await getHighestScoreGame();
			if (highestScoreGame?.id === gameState.id) {
				this.io.emit("highest-score-game", highestScoreGame);
			}
			this.heartbeatManager.setGameFinished(true);
		}

		this.io.to(gameId).emit("game-updated", gameState);
	}

	handleSwitchTurn({ gameId }: { gameId: string }): void {
		const game = this.gameController.switchTurn({ gameId });

		this.io.to(gameId).emit("turn-switched", game);
	}

	handleWatchGame(socket: Socket, { gameId }: { gameId: string }): void {
		const game = this.gameController.getGame(gameId);
		if (!game) {
			socket.emit("game-not-found");
			return;
		}
		socket.join(gameId);
	}

	handleRegisterSocket(
		socket: Socket,
		{ gameId, playerId }: { gameId: string; playerId: string },
	): void {
		this.heartbeatManager.registerSocket(socket, gameId, playerId);
		socket.join(gameId);

		const game = this.gameController.getGame(gameId);
		this.io.to(gameId).emit("game-updated", game?.getState());
	}

	async handleGetHighestScoreGame(): Promise<void> {
		const highestScoreGame = await getHighestScoreGame();
		this.io.emit("highest-score-game", highestScoreGame);
	}

	handleUnregisterSocket(socket: Socket, { gameId }: { gameId: string }): void {
		socket.leave(gameId);
	}

	handleDisconnect(socket: Socket): void {
		console.log("User disconnected: GAME EVENT HANDLER", socket.id);
		this.heartbeatManager.removeConnection(socket.id);
		this.io.emit("user-disconnected", socket.id);
	}

	handleHeartbeat(
		socket: Socket,
		{ gameId, playerId }: { gameId: string; playerId: string },
	): void {
		// Handle heartbeat
		console.log("Heartbeat received", gameId, playerId);
		this.heartbeatManager.recordHeartbeat(playerId);
	}
}

import type { Server, Socket } from "socket.io";
import type GamesController from "../controllers/games-controller";
import { HeartbeatManager } from "./heartbeat";
import { getHighestScoreGame } from "@memory-game/database";
import type {
	CreateGameData,
	FlipCardData,
	HeartbeatData,
	JoinGameData,
	LeaveGameData,
	RegisterSocketData,
	SwitchTurnData,
	UnregisterSocketData,
	WatchGameData,
} from "@memory-game/common";

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
		socket.on("create-game", (data: CreateGameData) =>
			this.handleCreateGame(socket, data),
		);
		socket.on("join-game", (data: JoinGameData) =>
			this.handleJoinGame(socket, data),
		);
		socket.on("leave-game", (data: LeaveGameData) =>
			this.handleLeaveGame(socket, data),
		);
		socket.on("register-socket", (data: RegisterSocketData) =>
			this.handleRegisterSocket(socket, data),
		);
		socket.on("unregister-socket", (data: UnregisterSocketData) =>
			this.handleUnregisterSocket(socket, data),
		);
		socket.on("heartbeat", (data: HeartbeatData) =>
			this.handleHeartbeat(socket, data),
		);
		socket.on("start-game", (data) => this.handleStartGame(socket, data));
		socket.on("flip-card", (data: FlipCardData) => this.handleFlipCard(data));
		socket.on("switch-turn", (data: SwitchTurnData) =>
			this.handleSwitchTurn(data),
		);
		socket.on("watch-game", (data: WatchGameData) =>
			this.handleWatchGame(socket, data),
		);
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
		{ username, gameTitle, cardCount = 12, playMode }: CreateGameData,
	): void {
		const socketId = socket.id;
		const game = this.gameController.createGame({
			username,
			gameTitle,
			socketId,
			cardCount,
			playMode,
		});

		const player = game.players[0];

		socket.join(game.id);
		this.heartbeatManager.registerSocket(socket, game.id, player.id);

		const games = this.gameController.getInMemoryGames();
		this.io.emit("games", games);

		this.io.emit("game-created", game);
	}

	handleJoinGame(socket: Socket, { gameId, username }: JoinGameData): void {
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

	handleLeaveGame(socket: Socket, { gameId, playerId }: LeaveGameData): void {
		const game = this.gameController.leaveGame({ gameId, playerId });
		socket.leave(gameId);

		this.io.to(gameId).emit("player-left", playerId);
		this.io.to(gameId).emit("game-updated", game);
	}

	handleStartGame(socket: Socket, { gameId }: { gameId: string }): void {
		const game = this.gameController.startGame({ gameId });

		this.io.to(gameId).emit("game-updated", game);
	}

	async handleFlipCard({ gameId, playerId, id }: FlipCardData): Promise<void> {
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

	handleSwitchTurn({ gameId }: SwitchTurnData): void {
		const game = this.gameController.switchTurn({ gameId });

		this.io.to(gameId).emit("turn-switched", game);
	}

	handleWatchGame(socket: Socket, { gameId }: WatchGameData): void {
		const game = this.gameController.getGame(gameId);
		if (!game) {
			socket.emit("game-not-found");
			return;
		}
		socket.join(gameId);
	}

	handleRegisterSocket(
		socket: Socket,
		{ gameId, playerId }: RegisterSocketData,
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

	handleUnregisterSocket(
		socket: Socket,
		{ gameId }: UnregisterSocketData,
	): void {
		socket.leave(gameId);
	}

	handleDisconnect(socket: Socket): void {
		console.log("User disconnected: GAME EVENT HANDLER", socket.id);
		this.heartbeatManager.removeConnection(socket.id);
		this.io.emit("user-disconnected", socket.id);
	}

	handleHeartbeat(socket: Socket, { gameId, playerId }: HeartbeatData): void {
		// Handle heartbeat
		console.log("Heartbeat received", gameId, playerId);
		this.heartbeatManager.recordHeartbeat(playerId);
	}
}

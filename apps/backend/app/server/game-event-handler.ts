import type { Server, Socket } from "socket.io";
import type GamesController from "../controllers/games.controller";
import { HeartbeatManager } from "./heartbeat";

export class GameEventHandler {
	private heartbeatManager: HeartbeatManager;

	constructor(
		private io: Server,
		private gameController: GamesController,
	) {
		this.heartbeatManager = new HeartbeatManager(this);
	}

	handleConnection(socket: Socket): void {
		socket.on("create-game", (data) => this.handleCreateGame(socket, data));
		socket.on("join-game", (data) => this.handleJoinGame(socket, data));
		socket.on("leave-game", (data) => this.handleLeaveGame(socket, data));
		socket.on("heartbeat", (data) => this.handleHeartbeat(socket, data));
		socket.on("disconnect", () => this.handleDisconnect(socket));
	}

	handleCreateGame(
		socket: Socket,
		{ username, gameTitle }: { username: string; gameTitle: string },
	): void {
		const game = this.gameController.createGame({ username, gameTitle });

		const player = game.players[0];

		socket.join(game.id);
		this.heartbeatManager.registerSocket(socket, game.id, player.id);

		// Update player's socket ID
		player.socketId = socket.id;

		this.io.emit("game-created", game);
	}

	handleJoinGame(
		socket: Socket,
		{ gameId, username }: { gameId: string; username: string },
	): void {
		const { playerId, game } = this.gameController.joinGame({
			gameId,
			username,
		});

		socket.join(gameId);
		this.heartbeatManager.registerSocket(socket, gameId, playerId);

		game.players[1].socketId = socket.id;

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

	handleDisconnect(socket: Socket): void {
		console.log("User disconnected", socket.id);
		// this.heartbeatManager.removeConnection(socket.id);
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

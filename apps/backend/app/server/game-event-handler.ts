import type { GameState } from "@common/types/game.types";
import type { Server, Socket } from "socket.io";

interface IGameController {
	createGame({
		username,
		gameTitle,
	}: { username: string; gameTitle: string }): GameState;
	joinGame({ gameId, username }: { gameId: string; username: string }): {
		playerId: string;
		game: GameState;
	};
	leaveGame({
		gameId,
		playerId,
	}: { gameId: string; playerId: string }): GameState | null;
}

export class GameEventHandler {
	constructor(
		private io: Server,
		private gameController: IGameController,
	) {}

	handleConnection(socket: Socket): void {
		socket.on("create-game", (data) => this.handleCreateGame(socket, data));
		socket.on("join-game", (data) => this.handleJoinGame(socket, data));
		socket.on("leave-game", (data) => this.handleLeaveGame(socket, data));
		socket.on("disconnect", () => this.handleDisconnect(socket));
	}

	handleCreateGame(
		socket: Socket,
		{ username, gameTitle }: { username: string; gameTitle: string },
	): void {
		const game = this.gameController.createGame({ username, gameTitle });
		socket.join(game.id);

		// Update player's socket ID
		game.players[0].socketId = socket.id;

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
	}

	// ... other handlers
}

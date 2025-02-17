import type { PlayerConnection } from "@common/types/game.types";
import type { Server, Socket } from "socket.io";
import type { GameEventHandler } from "./game-event-handler";

export class HeartbeatManager {
	private readonly HEARTBEAT_INTERVAL = 3000; // Send heartbeat every 3 seconds
	private readonly HEARTBEAT_TIMEOUT = 5000; // Consider disconnected after 10 seconds
	private readonly MAX_MISSED_BEATS = 1; // Maximum missed heartbeats before disconnect

	private connections: Map<
		string,
		{ connection: PlayerConnection; socket: Socket }
	> = new Map();
	private intervalId: NodeJS.Timeout | null = null;
	private gameHandler: GameEventHandler;

	constructor(gameHandler: GameEventHandler) {
		this.gameHandler = gameHandler;
	}

	public registerSocket(socket: Socket, gameId: string, playerId: string) {
		this.registerConnection(playerId, gameId, socket);
	}

	private registerConnection(playerId: string, gameId: string, socket: Socket) {
		this.connections.set(playerId, {
			connection: {
				playerId,
				gameId,
				lastHeartbeat: Date.now(),
				missedBeats: 0,
			},
			socket,
		});
		this.startHeartbeatMonitor();
	}

	recordHeartbeat(playerId: string) {
		const entry = this.connections.get(playerId);
		if (entry) {
			entry.connection.lastHeartbeat = Date.now();
			entry.connection.missedBeats = 0;
		}
	}

	removeConnection(playerId: string) {
		this.connections.delete(playerId);
	}

	private startHeartbeatMonitor() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}

		this.intervalId = setInterval(() => {
			this.checkConnections();
		}, this.HEARTBEAT_INTERVAL);
	}

	private async checkConnections() {
		const now = Date.now();

		for (const { connection, socket } of this.connections.values()) {
			const timeSinceLastHeartbeat = now - connection.lastHeartbeat;

			if (timeSinceLastHeartbeat >= this.HEARTBEAT_TIMEOUT) {
				connection.missedBeats++;

				if (connection.missedBeats >= this.MAX_MISSED_BEATS) {
					await this.handleDisconnection(connection, socket);
				}
			}
		}
	}

	private async handleDisconnection(
		connection: PlayerConnection,
		socket: Socket,
	) {
		console.log(
			`Player ${connection.playerId} disconnected due to missed heartbeats`,
		);

		this.removeConnection(connection.playerId);

		// Pass the actual socket instance
		this.gameHandler.handleLeaveGame(socket, {
			gameId: connection.gameId,
			playerId: connection.playerId,
		});
	}

	public stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatManager = void 0;
class HeartbeatManager {
    constructor(gameHandler) {
        this.HEARTBEAT_INTERVAL = 3000; // Send heartbeat every 3 seconds
        this.HEARTBEAT_TIMEOUT = 5000; // Consider disconnected after 10 seconds
        this.MAX_MISSED_BEATS = 1; // Maximum missed heartbeats before disconnect
        this.connections = new Map();
        this.intervalId = null;
        this.gameHandler = gameHandler;
    }
    registerSocket(socket, gameId, playerId) {
        this.registerConnection(playerId, gameId, socket);
    }
    registerConnection(playerId, gameId, socket) {
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
    recordHeartbeat(playerId) {
        const entry = this.connections.get(playerId);
        if (entry) {
            entry.connection.lastHeartbeat = Date.now();
            entry.connection.missedBeats = 0;
        }
    }
    removeConnection(playerId) {
        this.connections.delete(playerId);
    }
    startHeartbeatMonitor() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => {
            this.checkConnections();
        }, this.HEARTBEAT_INTERVAL);
    }
    async checkConnections() {
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
    async handleDisconnection(connection, socket) {
        console.log(`Player ${connection.playerId} disconnected due to missed heartbeats`);
        this.removeConnection(connection.playerId);
        // Pass the actual socket instance
        this.gameHandler.handleLeaveGame(socket, {
            gameId: connection.gameId,
            playerId: connection.playerId,
        });
    }
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
exports.HeartbeatManager = HeartbeatManager;
//# sourceMappingURL=heartbeat.js.map
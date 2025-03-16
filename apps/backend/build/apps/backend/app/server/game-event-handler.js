"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEventHandler = void 0;
const heartbeat_1 = require("./heartbeat");
class GameEventHandler {
    constructor(io, gameController) {
        this.io = io;
        this.gameController = gameController;
        this.heartbeatManager = new heartbeat_1.HeartbeatManager(this);
    }
    handleConnection(socket) {
        socket.on("get-games", () => this.handleGetGames());
        socket.on("create-game", (data) => this.handleCreateGame(socket, data));
        socket.on("join-game", (data) => this.handleJoinGame(socket, data));
        socket.on("leave-game", (data) => this.handleLeaveGame(socket, data));
        socket.on("heartbeat", (data) => this.handleHeartbeat(socket, data));
        socket.on("start-game", (data) => this.handleStartGame(socket, data));
        socket.on("flip-card", (data) => this.handleFlipCard(socket, data));
        socket.on("switch-turn", (data) => this.handleSwitchTurn(socket, data));
        socket.on("disconnect", () => this.handleDisconnect(socket));
        socket.on("request-game-state", ({ gameId }) => {
            const game = this.gameController.getGame(gameId);
            if (game) {
                socket.emit("game-state", game.getState());
            }
        });
    }
    handleGetGames() {
        const games = this.gameController.getInMemoryGames();
        this.io.emit("games", games);
    }
    handleCreateGame(socket, { username, gameTitle }) {
        const game = this.gameController.createGame({ username, gameTitle });
        const player = game.players[0];
        socket.join(game.id);
        this.heartbeatManager.registerSocket(socket, game.id, player.id);
        // Update player's socket ID
        player.socketId = socket.id;
        this.io.emit("game-created", game);
    }
    handleJoinGame(socket, { gameId, username }) {
        const { playerId, game } = this.gameController.joinGame({
            gameId,
            username,
        });
        if (!game) {
            socket.emit("game-not-found");
            return;
        }
        socket.join(gameId);
        this.heartbeatManager.registerSocket(socket, gameId, playerId);
        game.players[1].socketId = socket.id;
        this.io.to(gameId).emit("player-joined", playerId);
        this.io.to(gameId).emit("game-updated", game);
    }
    handleLeaveGame(socket, { gameId, playerId }) {
        const game = this.gameController.leaveGame({ gameId, playerId });
        socket.leave(gameId);
        this.io.to(gameId).emit("player-left", playerId);
        this.io.to(gameId).emit("game-updated", game);
    }
    handleStartGame(socket, { gameId }) {
        const game = this.gameController.startGame({ gameId });
        this.io.to(gameId).emit("game-updated", game);
    }
    handleFlipCard(socket, { gameId, playerId, id }) {
        const gameState = this.gameController.flipCard({
            gameId,
            id,
            playerId,
        });
        this.io.to(gameId).emit("game-updated", gameState);
    }
    handleSwitchTurn(socket, { gameId }) {
        const game = this.gameController.switchTurn({ gameId });
        this.io.to(gameId).emit("turn-switched", game);
        console.log("TURN SWITCHED emitted once");
    }
    handleDisconnect(socket) {
        console.log("User disconnected", socket.id);
        // this.heartbeatManager.removeConnection(socket.id);
    }
    handleHeartbeat(socket, { gameId, playerId }) {
        // Handle heartbeat
        console.log("Heartbeat received", gameId, playerId);
        this.heartbeatManager.recordHeartbeat(playerId);
    }
}
exports.GameEventHandler = GameEventHandler;
//# sourceMappingURL=game-event-handler.js.map
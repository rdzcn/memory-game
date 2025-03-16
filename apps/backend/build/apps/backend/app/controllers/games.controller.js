"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeGames = exports.readGames = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const game_1 = require("../game");
const GAMES_FILE = node_path_1.default.resolve(__dirname, "../../data/games.json");
const readGames = () => {
    if (!node_fs_1.default.existsSync(GAMES_FILE))
        return {};
    return JSON.parse(node_fs_1.default.readFileSync(GAMES_FILE, "utf8"));
};
exports.readGames = readGames;
const writeGames = (games) => {
    node_fs_1.default.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 4));
};
exports.writeGames = writeGames;
class GamesController {
    constructor() {
        this.games = new Map();
        // Convert saved game states back to Game instances
        const savedGames = (0, exports.readGames)();
        for (const [gameId, gameState] of Object.entries(savedGames)) {
            const game = new game_1.Game(gameState.title, true);
            console.log("CONSTRUCTIR", game);
            // Restore the game state
            game.restoreState(gameState);
            this.games.set(gameId, game);
        }
    }
    createGame({ gameTitle, username }) {
        const playerId = crypto.randomUUID();
        const newGame = new game_1.Game(gameTitle);
        const player = {
            id: playerId,
            name: username,
            socketId: "",
            score: 0,
        };
        newGame.addPlayer(player);
        const gameId = newGame.getId();
        // Store the Game instance
        this.games.set(gameId, newGame);
        // Save game state to file
        const games = (0, exports.readGames)();
        games[gameId] = newGame.getState();
        (0, exports.writeGames)(games);
        return newGame.getState();
    }
    joinGame({ gameId, username }) {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error("Game not found");
        }
        // Now you have access to all Game instance methods
        const playerId = crypto.randomUUID();
        const player = {
            id: playerId,
            name: username,
            socketId: "",
            score: 0,
        };
        game.addPlayer(player);
        // Save updated state
        const games = (0, exports.readGames)();
        games[gameId] = game.getState();
        (0, exports.writeGames)(games);
        return { playerId, game: game.getState() };
    }
    getInMemoryGames() {
        return Array.from(this.games.values());
    }
    getGame(gameId) {
        return this.games.get(gameId);
    }
    leaveGame({ gameId, playerId }) {
        const game = this.games.get(gameId);
        if (!game) {
            return null;
        }
        // Use the Game instance method to remove player
        game.removePlayer(playerId);
        // If no players left, remove the game
        if (game.getState().players.length === 0) {
            this.games.delete(gameId);
            this.saveGames();
            return null;
        }
        // Save the updated state
        const games = (0, exports.readGames)();
        games[gameId] = game.getState();
        (0, exports.writeGames)(games);
        return game.getState();
    }
    startGame({ gameId }) {
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
        const games = (0, exports.readGames)();
        games[gameId] = game.getState();
        (0, exports.writeGames)(games);
        return game.getState();
    }
    saveGames() {
        const gameStates = Object.fromEntries(Array.from(this.games.entries()).map(([id, game]) => [
            id,
            game.getState(),
        ]));
        (0, exports.writeGames)(gameStates);
    }
    flipCard({ gameId, id, playerId, }) {
        const game = this.games.get(gameId);
        if (!game) {
            return null;
        }
        const isFlipped = game.flipCard({ id, playerId });
        if (isFlipped) {
            // Save the updated state
            const games = (0, exports.readGames)();
            games[gameId] = game.getState();
            (0, exports.writeGames)(games);
        }
        return game.getState();
    }
    switchTurn({ gameId }) {
        const game = this.games.get(gameId);
        if (!game) {
            return null;
        }
        game.switchTurn();
        const games = (0, exports.readGames)();
        games[gameId] = game.getState();
        (0, exports.writeGames)(games);
        return game.getState();
    }
    // express handlers
    async getAllGames(_req, res) {
        try {
            const games = Array.from(this.games.values());
            res.json(games);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async getGameById(req, res) {
        const { id } = req.params;
        // Reload games from JSON
        const savedGames = (0, exports.readGames)();
        if (savedGames[id]) {
            const game = new game_1.Game(savedGames[id].title, true);
            this.games.set(id, game);
            game.restoreState(savedGames[id]);
        }
        const game = this.getGame(id);
        if (!game) {
            res.status(404).json({ message: "Game not found" });
            return;
        }
        res.json(game);
    }
}
exports.default = GamesController;
//# sourceMappingURL=games.controller.js.map
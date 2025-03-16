"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const cors_1 = __importDefault(require("cors"));
const middleware_1 = require("./middleware");
const games_controller_1 = __importDefault(require("./controllers/games.controller"));
const game_event_handler_1 = require("./server/game-event-handler");
// const HEARTBEAT_INTERVAL = 5000;
// const PLAYER_TIMEOUT = 10000;
const PORT = 4040;
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(middleware_1.errorHandler);
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const gamesController = new games_controller_1.default();
const gameEventHandler = new game_event_handler_1.GameEventHandler(io, gamesController);
// WebSocket connection
io.on("connection", (socket) => {
    console.log("🚀 A user connected", socket.id);
    gameEventHandler.handleConnection(socket);
    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });
});
// Routes
app.get("/", (req, res) => {
    res.send("Hello, Express!");
});
app.get("/games", (req, res) => {
    gamesController.getAllGames(req, res);
});
app.get("/games/:id", (req, res) => {
    gamesController.getGameById(req, res);
});
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
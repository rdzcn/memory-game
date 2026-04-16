import { io, type Socket } from "socket.io-client";

const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:4102"
        : "https://api.ardinho.com";

const path =
    process.env.NODE_ENV === "development"
        ? "/socket.io"
        : "/memory-game/socket.io/";

const socket: Socket = io(url, {
    path,
    transports: ["websocket", "polling"],
    secure: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

socket.on("connect", () => {
	console.log("Connected to server - SOCKET HANDLER", socket.id);
});

socket.on("disconnect", () => {
	console.log("Disconnected from server");
});

socket.on("connect_error", (error) => {
	console.error("Connection error:", error);
});

export default socket;

import { io } from "socket.io-client";

const url =
	process.env.NODE_ENV === "development"
		? "http://localhost:4040"
		: "https://developing-garnet-rdzcn-64909d47.koyeb.app";

const socket = io(url, {
	path: "/api/socket.io",
	transports: ["websocket", "polling"],
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
});

socket.on("connect", () => {
	console.log("Connected to server", socket.id);
});

socket.on("connect_error", (error) => {
	console.error("Connection error:", error);
});

export default socket;

import { io } from "socket.io-client";

const url =
	process.env.NODE_ENV === "development"
		? "http://localhost:4040"
		: "https://api.memorygameclub.com";

// const url = "https://api.memorygameclub.com";

const socket = io(url, {
	path: "/socket.io",
	transports: ["websocket", "polling"],
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

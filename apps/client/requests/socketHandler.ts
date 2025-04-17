import { io } from "socket.io-client";

// const url =
// 	process.env.NODE_ENV === "development"
// 		? "http://localhost:4040"
// 		: "http://v2202504265540330065.luckysrv.de:4040";

const url = "http://v2202504265540330065.luckysrv.de:4040";

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

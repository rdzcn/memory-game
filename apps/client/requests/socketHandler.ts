import { io } from "socket.io-client";

const socket = io("http://localhost:4040", {
	transports: ["websocket", "polling"],
});

socket.on("connect", () => {
	console.log("Connected to server", socket.id);
});

export default socket;

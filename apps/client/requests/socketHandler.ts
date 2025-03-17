import { io } from "socket.io-client";

// Determine the correct Socket.IO endpoint based on environment
const getSocketUrl = () => {
	if (process.env.NODE_ENV === "production") {
		return {
			url: window.location.origin,
			path: "/api/socket.io",
		};
	}
	return {
		url: "http://localhost:4040",
		path: "/socket.io",
	};
};

const { url, path } = getSocketUrl();

const socket = io(url, {
	path: path,
	transports: ["websocket", "polling"],
});

socket.on("connect", () => {
	console.log("Connected to server", socket.id);
});

export default socket;

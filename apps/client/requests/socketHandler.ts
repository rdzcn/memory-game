import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

// Determine the correct Socket.IO endpoint based on environment
const getSocketUrl = () => {
	if (typeof window === "undefined") {
		return { url: "http://localhost:4040", path: "/socket.io" };
	}

	if (process.env.NODE_ENV === "production") {
		return { url: window.location.origin, path: "/api/socket.io" };
	}

	return { url: "http://localhost:4040", path: "/socket.io" };
};

// const { url, path } = getSocketUrl();

// const socket = io(url, {
// 	path: path,
// 	transports: ["websocket", "polling"],
// });

// socket.on("connect", () => {
// 	console.log("Connected to server", socket.id);
// });

// export default socket;

const useSocket = () => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const { url, path } = getSocketUrl();
		const newSocket = io(url, { path, transports: ["websocket", "polling"] });

		newSocket.on("connect", () => {
			console.log("Connected to server", newSocket.id);
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	return socket;
};

export default useSocket;

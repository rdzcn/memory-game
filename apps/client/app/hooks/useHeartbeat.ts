import { useEffect } from "react";
import type { Socket } from "socket.io-client";

const useHeartbeat = ({
	socket,
	gameId,
	playerId,
	isFinished,
}: {
	socket: Socket | null;
	gameId: string;
	playerId: string | null;
	isFinished: boolean;
}) => {
	useEffect(() => {
		if (!socket || !gameId || !playerId || isFinished) return;

		console.log(`Starting heartbeat for Player ${playerId} in Game ${gameId}`);

		let heartbeatInterval: NodeJS.Timeout | null = null;

		const sendHeartbeat = () => {
			if (isFinished) {
				console.log(`Game finished. Stopping heartbeat for ${playerId}`);
				if (heartbeatInterval) clearInterval(heartbeatInterval);
				return;
			}
			if (socket.connected) {
				socket.emit("heartbeat", { gameId, playerId });
			} else {
				console.warn(`Socket disconnected, skipping heartbeat for ${playerId}`);
			}
		};

		// Start sending heartbeats
		heartbeatInterval = setInterval(sendHeartbeat, 3000);

		// Listen for socket disconnect/reconnect
		const handleDisconnect = () => {
			if (heartbeatInterval) {
				clearInterval(heartbeatInterval);
				heartbeatInterval = null; // Prevent potential memory leaks
			}
		};
		const handleReconnect = () => {
			if (!heartbeatInterval && !isFinished) {
				heartbeatInterval = setInterval(sendHeartbeat, 3000);
			}
		};

		socket.on("disconnect", handleDisconnect);
		socket.on("connect", handleReconnect);

		// Cleanup on unmount or dependency change
		return () => {
			if (heartbeatInterval) {
				clearInterval(heartbeatInterval);
				heartbeatInterval = null;
			}
			socket.off("disconnect", handleDisconnect);
			socket.off("connect", handleReconnect);
			console.log(`Stopped heartbeat for Player ${playerId}`);
		};
	}, [socket, gameId, playerId, isFinished]);
};

export default useHeartbeat;

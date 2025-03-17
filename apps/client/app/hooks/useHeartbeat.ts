import { useEffect } from "react";
import type { Socket } from "socket.io-client";

const useHeartbeat = (
	socket: Socket | null,
	gameId: string,
	playerId: string | null,
) => {
	useEffect(() => {
		if (!socket || !gameId || !playerId) return;

		const heartbeatInterval = setInterval(() => {
			socket.emit("heartbeat", { gameId, playerId });
		}, 3000);

		// Cleanup on unmount
		return () => {
			clearInterval(heartbeatInterval);
		};
	}, [socket, gameId, playerId]);
};

export default useHeartbeat;

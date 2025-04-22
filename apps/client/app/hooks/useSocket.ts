import { useEffect, useRef } from "react";
import io, { type Socket } from "socket.io-client";

export function useSocket(): Socket | null {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		if (!socketRef.current) {
			socketRef.current = io("http://localhost:4040"); // Adjust port as needed
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []);

	return socketRef.current;
}

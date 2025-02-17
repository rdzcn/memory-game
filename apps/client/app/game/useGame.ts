import { useReducer, useEffect, useCallback } from "react";
import type { Socket } from "socket.io-client";

export const useGame = (socket: Socket, gameId: string) => {
	const [state, dispatch] = useReducer(gameReducer, {
		status: "idle",
		players: [],
		currentPlayer: "",
		cards: [],
		flippedCards: [],
		score: {},
	});

	// Handle incoming socket events
	useEffect(() => {
		socket.on("game:state", (gameState: GameState) => {
			dispatch({ type: "SYNC_STATE", payload: gameState });
		});

		socket.on("game:error", (error: string) => {
			dispatch({ type: "SET_ERROR", payload: error });
		});

		return () => {
			socket.off("game:state");
			socket.off("game:error");
		};
	}, [socket]);

	// Action handlers that emit socket events
	const flipCard = useCallback(
		(cardId: number) => {
			socket.emit("game:action", {
				gameId,
				action: "FLIP_CARD",
				payload: { cardId },
			});
			dispatch({ type: "FLIP_CARD", payload: { cardId } });
		},
		[socket, gameId],
	);

	return {
		state,
		actions: {
			flipCard,
		},
	};
};

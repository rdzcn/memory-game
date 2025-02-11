"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { GameState } from "@common/types";
import socket from "@/requests/socketHandler";
import { Button } from "@/components/ui/button";
import useHeartbeat from "@/app/hooks/useHeartbeat";

interface GameBoardProps {
	gameData: GameState;
}

export default function GameBoard({ gameData }: GameBoardProps) {
	const [game, setGame] = useState(gameData);
	const searchParams = useSearchParams();
	const router = useRouter();
	const playerId = searchParams.get("playerId");

	useHeartbeat(socket, game.id, playerId);

	const handleLeaveGame = useCallback(() => {
		if (playerId) {
			socket.emit("leave-game", { gameId: game.id, playerId });
		}
		router.push("/");
	}, [playerId, game.id, router]);

	useEffect(() => {
		socket.on("game-updated", (updatedGame) => {
			setGame(updatedGame);
		});

		return () => {
			socket.off("game-updated");
			// clearInterval(heartbeatInterval);
		};
	}, []);

	const handleLeaveGameClick = () => {
		handleLeaveGame();
	};

	return (
		<div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-6">
			<h3 className="text-lg font-semibold text-blue-400 mb-4">{game.title}</h3>
			<h2 className="text-2xl font-semibold text-white mb-4">{playerId}</h2>
			<pre className="bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
				{JSON.stringify(game, null, 2)}
			</pre>
			<Button className="mt-4" onClick={handleLeaveGameClick}>
				Leave game
			</Button>
		</div>
	);
}

"use client";

import { useEffect, useState } from "react";
import type { Game } from "@common/types";
import socket from "@/requests/socketHandler";
import { Button } from "@/components/ui/button";

interface GameBoardProps {
	gameData: Game;
}

export default function GameBoard({ gameData }: GameBoardProps) {
	const [game, setGame] = useState(gameData);

	useEffect(() => {
		socket.on("gameUpdated", (updatedGame) => {
			setGame(updatedGame);
		});

		return () => {
			socket.off("gameUpdated");
		};
	}, []);

	return (
		<div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-6">
			<h3 className="text-lg font-semibold text-blue-400 mb-4">
				{game.gameTitle}
			</h3>
			<pre className="bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
				{JSON.stringify(game, null, 2)}
			</pre>
			<Button className="mt-4">Leave game</Button>
		</div>
	);
}

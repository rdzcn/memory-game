"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { GameState } from "@common/types";
import socket from "@/requests/socketHandler";
import { Button } from "@/components/ui/button";
import useHeartbeat from "@/app/hooks/useHeartbeat";
// import { GameClientState } from "../game.reducer";
import cardData, { type CardData } from "../data/cards";
import { MemoryCard } from "../components/memory-card";
import { set } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameBoardProps {
	gameData: GameState;
}

export default function GameBoard({ gameData }: GameBoardProps) {
	const [game, setGame] = useState(gameData);
	const searchParams = useSearchParams();
	const router = useRouter();
	const playerId = searchParams.get("playerId");
	const player = game.players.find((player) => player.id === playerId);

	useHeartbeat(socket, game.id, playerId);

	const handleLeaveGame = useCallback(() => {
		if (playerId) {
			socket.emit("leave-game", { gameId: game.id, playerId });
		}
		router.push("/");
	}, [playerId, game.id, router]);

	console.log("GameBoard", game);

	useEffect(() => {
		socket.emit("request-game-state", { gameId: game.id });

		const handleGameUpdated = (updatedGame: GameState) => {
			setGame(updatedGame);
		};

		socket.on("game-state", handleGameUpdated);
		socket.on("game-updated", handleGameUpdated);
		socket.on("turn-switched", handleGameUpdated);

		return () => {
			socket.off("game-updated", handleGameUpdated);
			socket.off("turn-switched", handleGameUpdated);
			socket.off("game-state", handleGameUpdated);
		};
	}, [game.id]);

	useEffect(() => {
		if (
			game.flippedCards.length === 2 &&
			game.flippedCards[0].value !== game.flippedCards[1].value &&
			game.currentTurn === playerId
		) {
			setTimeout(() => {
				socket.emit("switch-turn", { gameId: game.id });
				console.log("Switching turn");
			}, 500);
		}
	}, [game.flippedCards, game.id, playerId, game.currentTurn]);

	const handleLeaveGameClick = () => {
		handleLeaveGame();
	};

	const handleStartGame = () => {
		socket.emit("start-game", { gameId: game.id });
	};

	const handleFlipCard = ({ id }: { id: number }) => {
		if (playerId !== game.currentTurn) {
			return;
		}
		socket.emit("flip-card", { gameId: game.id, id, playerId });
	};

	return (
		<>
			<Card key={game.id} className="flex flex-col w-fit my-0 mx-auto">
				<CardHeader>
					<CardTitle>Current turn</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<span>
						{player?.id === game.currentTurn ? player.name : "Unknown"}
					</span>
				</CardContent>
			</Card>
			<div className="grid grid-cols-6 gap-8 w-fit mx-auto">
				{game.cards.map((card) => (
					<MemoryCard
						key={`${card.id}`}
						card={card}
						flippedCards={game.flippedCards}
						handleFlipCard={handleFlipCard}
					/>
				))}
			</div>
			<div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-6">
				<h3 className="text-lg font-semibold text-blue-400 mb-4">
					{game.title}
				</h3>
				<span className="text-sm">{`Player's turn: ${game.currentTurn}`}</span>
				<h2 className="text-2xl font-semibold text-white mb-4">{playerId}</h2>
				<Button className="mt-4" onClick={handleLeaveGameClick}>
					Leave game
				</Button>
			</div>
		</>
	);
}

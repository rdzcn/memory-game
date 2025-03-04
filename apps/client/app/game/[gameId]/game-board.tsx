"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { GameState } from "@common/types";
import socket from "@/requests/socketHandler";
import { Button } from "@/components/ui/button";
import useHeartbeat from "@/app/hooks/useHeartbeat";
// import { GameClientState } from "../game.reducer";
import cardData, { type CardData } from "../data/cards";
import { MemoryCard } from "../components/memory-card";
import { set } from "react-hook-form";

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
			console.log("GAME UPDATED", updatedGame);
			setGame(updatedGame);
		});

		socket.on("card-flipped", (flippedCards) => {
			// setFlippedCards((prevFlippedCards) => [...prevFlippedCards, flippedCard]);
		});

		return () => {
			socket.off("game-updated");
			socket.off("card-flipped");
		};
	}, []);

	useEffect(() => {
		if (
			game.flippedCards.length === 2 &&
			game.flippedCards[0].value !== game.flippedCards[1].value
		) {
			setTimeout(() => {
				socket.emit("switch-turn", { gameId: game.id });
				console.log("Switching turn");
			}, 500);
		}
	}, [game.flippedCards, game.id]);

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
			<div className="grid grid-cols-6 gap-8 w-fit my-0 mx-auto">
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

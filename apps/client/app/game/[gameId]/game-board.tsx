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

interface GameBoardProps {
	gameData: GameState;
}

// Fisher Yates Shuffle
function swap(array: CardData[], i: number, j: number) {
	const temp = array[i];
	array[i] = array[j];
	array[j] = temp;
}

function shuffleCards(array: CardData[]) {
	const length = array.length;
	for (let i = length; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * i);
		const currIndex = i - 1;
		swap(array, currIndex, randomIndex);
	}
	return array;
}

const generateCards = () => {
	const pairedCards: CardData[] = [...cardData].map((card) => {
		return { ...card, pairIndex: 1 };
	});

	return shuffleCards([...cardData, ...pairedCards]);
};

// const initialState = {
// 	gameState: GameClientState.IDLE,
// 	currentPlayer: 1,
// 	cards: generateCards(),
// 	flippedCards: [],
// 	matchedPairs: [],
// 	scores: { player1: 0, player2: 0 },
// };

export default function GameBoard({ gameData }: GameBoardProps) {
	const [game, setGame] = useState(gameData);
	const [flippedCards, setFlippedCards] = useState<CardData[]>([]);
	// const [state, dispatch] = useReducer(gameReducer, initialState);
	const memoryCards = generateCards();
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

		socket.on("card-flipped", (flippedCard) => {
			setFlippedCards((prevFlippedCards) => [...prevFlippedCards, flippedCard]);
		});

		return () => {
			socket.off("game-updated");
			socket.off("card-flipped");
		};
	}, []);

	const handleLeaveGameClick = () => {
		handleLeaveGame();
	};

	const handleStartGame = () => {
		socket.emit("start-game", { gameId: game.id });
	};

	const handleFlipCard = ({
		id,
		pairIndex,
	}: { id: string; pairIndex: number }) => {
		socket.emit("flip-card", { gameId: game.id, id, pairIndex });
	};

	return (
		<>
			{game.status !== "playing" ? (
				<Button onClick={handleStartGame} className="mb-4">
					Start game
				</Button>
			) : null}
			<ul className="grid grid-cols-6 gap-8 w-fit my-0 mx-auto">
				{memoryCards.map((card, index) => (
					<MemoryCard
						key={`${card.id}_${index}`}
						card={card}
						flippedCards={flippedCards}
						handleFlipCard={handleFlipCard}
						// dispatch={dispatch}
						// gameState={gameState}
					/>
				))}
			</ul>
			<div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-6">
				<h3 className="text-lg font-semibold text-blue-400 mb-4">
					{game.title}
				</h3>
				<h2 className="text-2xl font-semibold text-white mb-4">{playerId}</h2>
				<pre className="bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
					{JSON.stringify(game, null, 2)}
				</pre>
				<Button className="mt-4" onClick={handleLeaveGameClick}>
					Leave game
				</Button>
			</div>
		</>
	);
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Trophy, Timer, Users, LogOut, Sparkles, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import socket from "@/requests/socketHandler";
import { Button } from "@/components/ui/button";
import useHeartbeat from "@/app/hooks/useHeartbeat";
import { MemoryCard } from "../components/memory-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GameState, Player } from "@/types/game.types";

interface GameBoardProps {
	gameId: string;
}

export default function GameBoard({ gameId }: GameBoardProps) {
	const [game, setGame] = useState({} as GameState);
	const searchParams = useSearchParams();
	const router = useRouter();
	const playerId = searchParams.get("playerId");

	console.log("GameBoard", game);

	let player: Player | undefined;
	let otherPlayer: Player | undefined;

	if (playerId) {
		// Playing mode
		player = game.players?.find((player) => player.id === playerId);
		otherPlayer = game.players?.find((player) => player.id !== playerId);
	} else {
		// Viewing mode
		player = game.players?.[0];
		otherPlayer = game.players?.[1];
	}
	const matchedPairs = Math.floor(game.cards?.filter((card) => card.isMatched).length / 2);

	useHeartbeat({ socket, gameId: game.id, playerId, isFinished: matchedPairs === 12 });

	const handleLeaveGame = useCallback(() => {
		if (playerId) {
			socket.emit("leave-game", { gameId: game.id, playerId });
		} else {
			socket.emit("unregister-socket", { gameId: game.id });
		}
		router.push("/");
	}, [playerId, game.id, router]);

	useEffect(() => {
		if (gameId) {
			socket.emit("request-game-state", { gameId });
			if (!playerId) {
				socket.emit("watch-game", { gameId });
			} else {
				socket.emit("register-socket", { gameId, playerId });
			}
		}
	}, [gameId, playerId]);

	useEffect(() => {
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
	}, []);

	useEffect(() => {
		const handleReconnect = (socketId: string) => {
			console.log("User reconnected", socketId);
			if (socketId === socket.id) {
				console.log("Update player session");
				socket.emit("update-session", { gameId: game.id, playerId });
			}
		}
		socket.on("user-disconnected", handleReconnect);

		return () => {
			socket.off("user-disconnected", handleReconnect);
		};
	}, [game.id, playerId]);

	useEffect(() => {
		if (
			game.flippedCards?.length === 2 &&
			game.flippedCards[0]?.value !== game.flippedCards[1].value &&
			game.currentTurn === playerId
		) {
			setTimeout(() => {
				socket.emit("switch-turn", { gameId: game.id });
				console.log("Switching turn");
			}, 1000);
		}
	}, [game, playerId]);

	const handleStartNewGame = () => {
		console.log("Starting new game...");
		// socket.emit("start-game", { gameId: game.id });
	};

	const navigateToPlayground = () => {
		router.push("/");
		socket.emit("unregister-socket", { gameId: game.id });
	};

	const handleFlipCard = ({ id }: { id: number }) => {
		if (playerId !== game.currentTurn) {
			return;
		}
		socket.emit("flip-card", { gameId: game.id, id, playerId });
	};

	const currentPlayerName = playerId === game.currentTurn ? player?.name : otherPlayer?.name;

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8">
			<div className="max-w-5xl mx-auto">
				<div className="mb-6 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2 flex items-center justify-center gap-2">
						<Gamepad2 className="h-8 w-8" />
						Memory Match
					</h1>
					<p className="text-purple-600">Find all the matching pairs!</p>
				</div>
				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<div className="flex items-center gap-2">
							<Timer className="h-5 w-5 text-blue-600" />
							<span className="font-mono text-lg font-bold text-blue-700">{"TIMER"}</span>
						</div>
						<Badge variant="outline" className="bg-purple-100 text-purple-700 px-3 py-1 text-sm font-medium">
							<Users className="h-4 w-4 mr-1" />
							<span>Current Turn: {currentPlayerName}</span>
						</Badge>
						<div className="flex items-center gap-2">
							<Trophy className="h-5 w-5 text-amber-500" />
							<span className="font-bold text-amber-700">
								Pairs: {matchedPairs}/{game.cards?.length / 2}
							</span>
						</div>
					</div>

				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					{/* Player 1 */}
					<Card
						key={player?.name}
						className={cn(
							"p-4 transition-all duration-300",
							player?.id === game.currentTurn
								? "bg-gradient-to-r from-blue-100 to-purple-100 shadow-lg"
								: "bg-white",
						)}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div>
									<div className="font-bold text-lg text-purple-900">{player?.name}</div>
									<div className="flex items-center gap-1">
										<span className="text-amber-600 font-medium">Score: {player?.score}</span>
										{player?.id === game.currentTurn && (
											<motion.div
												animate={{ scale: [1, 1.2, 1] }}
												transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
											>
												<Sparkles className="h-4 w-4 text-yellow-500" />
											</motion.div>
										)}
									</div>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="text-red-600 border-red-200 hover:bg-red-50"
								onClick={handleLeaveGame}
							>
								<LogOut className="h-4 w-4 mr-1" />
								Leave
							</Button>
						</div>
					</Card>
					{/* Player 2 */}
					<Card
						key={otherPlayer?.name}
						className={cn(
							"p-4 transition-all duration-300 md:col-span-1 md:col-start-3",
							otherPlayer?.id === game.currentTurn
								? "bg-gradient-to-r from-blue-100 to-purple-100 shadow-lg"
								: "bg-white",
						)}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div>
									<div className="font-bold text-lg text-purple-900">{otherPlayer?.name}</div>
									<div className="flex items-center gap-1">
										<span className="text-amber-600 font-medium">Score: {otherPlayer?.score}</span>
										{otherPlayer?.id === game.currentTurn && (
											<motion.div
												animate={{ scale: [1, 1.2, 1] }}
												transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
											>
												<Sparkles className="h-4 w-4 text-yellow-500" />
											</motion.div>
										)}
									</div>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="text-red-600 border-red-200 hover:bg-red-50"
								onClick={handleLeaveGame}
							>
								<LogOut className="h-4 w-4 mr-1" />
								Leave
							</Button>
						</div>
						{player?.id && !otherPlayer ? (
							<Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-700 border border-yellow-200">
								Waiting to join...
							</Badge>
						) : null}
					</Card>
					<Card className="p-4 bg-white md:col-span-1 md:col-start-2">
						<div className="flex flex-col items-center justify-center gap-2">
							{matchedPairs === 12 ? (
								<>
									<div className="text-center mb-2">
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
											transition={{ duration: 0.5 }}
											className="text-4xl mb-1"
										>
											🎉
										</motion.div>
										<h3 className="font-bold text-green-600 text-lg">Game Complete!</h3>
										<p className="text-sm text-gray-600">Time: TIMER</p>
									</div>
									<Button
										onClick={() => playerId ? handleStartNewGame : navigateToPlayground}
										className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
									>
										{playerId ? "Play Again" : "Go to the Playground"}
									</Button>
								</>
							) : (
								<>
									<h3 className="font-bold text-purple-700">Game in Progress</h3>
									<Button
										onClick={() => playerId ? handleStartNewGame : navigateToPlayground}
										variant="outline"
										className="border-purple-200 text-purple-700 hover:bg-purple-50"
									>
										{playerId ? "Restart Game" : "Go to the Playground"}
									</Button>
								</>
							)}
						</div>
					</Card>
				</div>
				<div className="grid grid-cols-6 gap-2 md:grid-cols-6 md:gap-8 w-fit mx-auto">
					<AnimatePresence>
						{game.cards?.map((card, index) => (
							<motion.div
								key={card.id}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.3, delay: index * 0.03 }}
								className="aspect-square"
							>
								<MemoryCard
									key={`${card.id}`}
									card={card}
									handleFlipCard={handleFlipCard}
								/>
							</motion.div>
						))}

					</AnimatePresence>
				</div>
				{matchedPairs === 12 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
						onClick={() => console.log("RESET GAME")}
					>
						<motion.div
							initial={{ scale: 0.8, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							className="bg-white rounded-xl p-6 max-w-md text-center shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<motion.div
								animate={{
									rotate: [0, 10, -10, 10, -10, 0],
									y: [0, -10, 0],
								}}
								transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
								className="text-6xl mb-4"
							>
								🏆
							</motion.div>
							<h2 className="text-2xl font-bold text-purple-700 mb-2">Congratulations!</h2>
							<p className="text-gray-600 mb-4">You completed the game in TIMER!</p>
							<div className="mb-6">
								<h3 className="font-bold text-purple-600 mb-2">Final Scores:</h3>
								<div className="flex justify-center gap-6">
									{game.players.map((player, index) => (
										<div key={player.id} className="text-center">
											<div className="font-medium text-purple-900">{player.name}</div>
											<div className="text-amber-600 font-bold">{player.score}</div>
										</div>
									))}
								</div>
							</div>
							<div className="flex gap-2 justify-center">
								{/* <Button
									onClick={() => console.log("RESET GAME")}
									className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
								>
									Play Again
								</Button> */}
								<Button
									onClick={() => router.push("/")}
									className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
								>
									Go to the Playground
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</div>
		</div>
	);
}

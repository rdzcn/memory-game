"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import socket from "@/requests/socketHandler";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { GameState } from "@/types/game.types";
import CreateGameDialog from "./components/create-game-dialog";
import JoinGameDialog from "./components/join-game-dialog";
import { GameCard } from "./components/game-card";

export default function Home() {
	const [games, setGames] = useState<GameState[]>([]);

	useEffect(() => {
		socket.emit("get-games");
	}, []);

	useEffect(() => {
		socket.on("games", (games: GameState[]) => {
			setGames(games);
		});
		socket.on("game-created", (game: GameState) => {
			setGames((prevGames) => [...prevGames, game]);
		});

		return () => {
			socket.off("game-created");
			socket.off("games");
		};
	}, []);

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<main className="container mx-auto p-4">
					<h1 className="text-4xl font-bold text-center mb-8">
						Memory Game Central
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{games.map((game) => (
							// <Card key={game.id} className="flex flex-col">
							// 	<CardHeader>
							// 		<CardTitle>{game.title}</CardTitle>
							// 	</CardHeader>
							// 	<CardContent>
							// 		<p>Players: {game.players.length}</p>
							// 		<p>Status: {game.status}</p>
							// 	</CardContent>
							// 	<CardFooter className="mt-auto">
							// 		{game.players.length === 1 ? (
							// 			<JoinGameDialog gameId={game.id} />
							// 		) : (
							// 			<Link href={`/game/${game.id}`}>View Game</Link>
							// 		)}
							// 	</CardFooter>
							// </Card>
							<GameCard key={game.id} game={game} />
						))}
					</div>
					<div className="mt-8 text-center">
						<CreateGameDialog />
					</div>
				</main>
			</main>
		</div>
	);
}

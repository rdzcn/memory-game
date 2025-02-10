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
import type { GameState } from "@common/types";
import CreateGameDialog from "./create-game-dialog";
import JoinGameDialog from "./join-game-dialog";

interface GamesProps {
	initialGames: GameState[];
}

export default function Games({ initialGames }: GamesProps) {
	const [games, setGames] = useState(initialGames);

	useEffect(() => {
		socket.on("game-created", (game: GameState) => {
			console.log("Game created: GAMES", game);
			setGames((prevGames) => [...prevGames, game]);
		});

		return () => {
			socket.off("game-created");
		};
	}, []);

	return (
		<main className="container mx-auto p-4">
			<h1 className="text-4xl font-bold text-center mb-8">
				Memory Game Central
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{games.map((game) => (
					<Card key={game.id} className="flex flex-col">
						<CardHeader>
							<CardTitle>{game.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Players: {game.players.length}</p>
							<p>Status: {game.status}</p>
						</CardContent>
						<CardFooter className="mt-auto">
							{game.players.length === 1 ? (
								<JoinGameDialog gameId={game.id} />
							) : (
								<Link href={`/game/${game.id}`}>View Game</Link>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
			<div className="mt-8 text-center">
				<CreateGameDialog />
			</div>
		</main>
	);
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import socket from "@/requests/socketHandler";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Game } from "@common/types";
import CreateGameDialog from "./create-game-dialog";
import JoinGameDialog from "./join-game-dialog";

interface GamesProps {
	initialGames: Game[];
}

export default function Games({ initialGames }: GamesProps) {
	const [games, setGames] = useState(initialGames);

	useEffect(() => {
		socket.on("gameCreated", (newGame) => {
			setGames((prevGames) => [...prevGames, newGame]);
		});

		return () => {
			socket.off("gameCreated");
		};
	}, []);

	return (
		<main className="container mx-auto p-4">
			<h1 className="text-4xl font-bold text-center mb-8">
				Memory Game Central
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{games.map((game) => (
					<Card key={game.gameId} className="flex flex-col">
						<CardHeader>
							<CardTitle>{game.gameTitle}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Players: {game.players.length}</p>
							<p>
								Status: {game.players.length === 1 ? "Waiting" : "In Progress"}
							</p>
						</CardContent>
						<CardFooter className="mt-auto">
							{game.players.length === 1 ? (
								<JoinGameDialog gameId={game.gameId} />
							) : (
								"View Game"
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

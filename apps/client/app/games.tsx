"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Game } from "@common/types";
import Link from "next/link";
import CreateGameDialog from "./create-game-dialog";

interface GamesProps {
	games: Game[];
}

export default function Games({ games }: GamesProps) {
	return (
		<main className="container mx-auto p-4">
			<h1 className="text-4xl font-bold text-center mb-8">
				Memory Game Central
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{games.map((game) => (
					<Card key={game.gameId} className="flex flex-col">
						<CardHeader>
							<CardTitle>{game.gameId}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Players: {game.players.length}</p>
							<p>
								Status: {game.players.length === 1 ? "Waiting" : "In Progress"}
							</p>
						</CardContent>
						<CardFooter className="mt-auto">
							<Button asChild className="w-full">
								<Link href={`/game/${game.gameId}`}>
									{game.players.length === 1 ? "Join Game" : "View Game"}
								</Link>
							</Button>
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

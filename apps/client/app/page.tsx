"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import socket from "@/requests/socketHandler";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { GameState } from "@/types/game.types";
import CreateGameDialog from "./components/create-game-dialog";
import JoinGameDialog from "./components/join-game-dialog";
import { GameCard } from "./components/game-card";
import { Clock, Gamepad2, Star, Trophy, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
	const [games, setGames] = useState<GameState[]>([]);
	const [activeTab, setActiveTab] = useState("all")

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
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
			<div className="container py-8">
				<header className="mb-8 text-center">
					<div className="flex items-center justify-center mb-2">
						<Gamepad2 className="h-10 w-10 text-purple-600 mr-2" />
						<h1 className="text-4xl font-bold text-purple-600">Memory Game Central</h1>
					</div>
					<p className="text-lg text-purple-400">Fun memory games for kids!</p>
				</header>

				<div className="flex justify-between items-center mb-6">
					<div className="flex space-x-4">
						<Card className="bg-blue-50 border-blue-200">
							<CardContent className="p-4 flex items-center">
								<Users className="h-6 w-6 text-blue-500 mr-2" />
								<div>
									<p className="text-sm text-blue-700">Total Players</p>
									<p className="text-xl font-bold text-blue-800">24</p>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-purple-50 border-purple-200">
							<CardContent className="p-4 flex items-center">
								<Trophy className="h-6 w-6 text-purple-500 mr-2" />
								<div>
									<p className="text-sm text-purple-700">Games Completed</p>
									<p className="text-xl font-bold text-purple-800">18</p>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-amber-50 border-amber-200">
							<CardContent className="p-4 flex items-center">
								<Star className="h-6 w-6 text-amber-500 mr-2" />
								<div>
									<p className="text-sm text-amber-700">High Score</p>
									<p className="text-xl font-bold text-amber-800">42</p>
								</div>
							</CardContent>
						</Card>
					</div>

					<CreateGameDialog />
				</div>

				<Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
					<TabsList className="bg-purple-100">
						<TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
							All Games
						</TabsTrigger>
						<TabsTrigger value="progress" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
							In Progress
						</TabsTrigger>
						<TabsTrigger value="finished" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
							Finished
						</TabsTrigger>
					</TabsList>

					<TabsContent value="all" className="mt-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{games.map((game) => (
								<GameCard key={game.id} game={game} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="progress" className="mt-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{games
								.filter((g) => g.status === "waiting" || g.status === "playing")
								.map((game) => (
									<GameCard key={game.id} game={game} />
								))}
						</div>
					</TabsContent>

					<TabsContent value="finished" className="mt-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{games
								.filter((g) => g.status === "finished")
								.map((game) => (
									<GameCard key={game.id} game={game} />
								))}
						</div>
					</TabsContent>
				</Tabs>

				<div className="mt-8 text-center">
					<h2 className="text-2xl font-bold text-purple-600 mb-4">Recent Achievements</h2>
					<div className="flex justify-center space-x-4">
						<Card className="w-64 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
							<CardHeader className="pb-2">
								<CardTitle className="text-amber-700">Perfect Match!</CardTitle>
								<CardDescription className="text-amber-600">Found all pairs without mistakes</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<Trophy className="h-16 w-16 text-amber-500 mx-auto my-2" />
							</CardContent>
						</Card>

						<Card className="w-64 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
							<CardHeader className="pb-2">
								<CardTitle className="text-blue-700">Speed Master</CardTitle>
								<CardDescription className="text-blue-600">Completed a game in under 30 seconds</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<Clock className="h-16 w-16 text-blue-500 mx-auto my-2" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

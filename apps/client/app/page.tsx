"use client";

import { useEffect, useState } from "react";
import socket from "@client/requests/socketHandler";
import {
	Card,
	CardContent,
} from "@client/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@client/components/ui/tabs";
import type { DatabaseGame, GameState } from "@memory-game/common";
import CreateGameDialog from "./components/create-game-dialog";
import { GameCard } from "./components/game-card";
import { Clock, Gamepad2, Star, Trophy, Users } from "lucide-react";
import { HighScoreCard } from "./components/highest-score-card";
import DashboardStats from "./components/dashboard-stats";

interface DashboardStatistics {
	highestScoreGame: DatabaseGame;
	gamesCount: number;
}

export default function Home() {
	const [games, setGames] = useState<GameState[]>([]);
	const [onlineUsers, setOnlineUsers] = useState(0);
	const [dashboardStatistics, setDashboardStatistics] = useState<DashboardStatistics | null>(null);
	const [activeTab, setActiveTab] = useState("all")

	useEffect(() => {
		socket.emit("get-games");
		socket.emit("get-dashboard-statistics");
	}, []);

	useEffect(() => {
		const setGamesData = (games: GameState[]) => {
			setGames(games);
		};

		socket.on("dashboard-statistics", (statistics: DashboardStatistics) => {
			setDashboardStatistics(statistics);
		});
		socket.on("games", setGamesData);
		socket.on("user-count", ({ count }: { count: number }) => {
			setOnlineUsers(count);
		});

		return () => {
			socket.off("games");
			socket.off("user-count");
			socket.off("dashboard-statistics");
		};
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
			<div className="container py-4 md:py-8 px-4 md:px-8 ">
				<header className="mb-8 text-center">
					<div className="flex items-center justify-center mb-2">
						<Gamepad2 className="h-10 w-10 text-purple-600 mr-2" />
						<h1 className="text-4xl font-bold text-purple-600">Memory Game Central</h1>
					</div>
					<p className="text-lg text-purple-400">Fun memory games for kids!</p>
				</header>
				{dashboardStatistics ?
					<div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
						<DashboardStats onlineUsers={onlineUsers} dashboardStatistics={dashboardStatistics} />
					</div> :
					null}
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
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
			</div>
		</div>
	)
}

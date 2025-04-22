"use client"

import { useRouter } from "next/navigation";
import { Gem, Timer, Trophy, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@client/components/ui/card"
import { Button } from "@client/components/ui/button"
import { Badge } from "@client/components/ui/badge"
import type { GameState } from "@memory-game/common"
import JoinGameDialog from "./join-game-dialog"
import { calculateGameDuration } from "../utils";

export function GameCard({ game }: { game: GameState }) {
	const router = useRouter();
	const getStatusColor = (status: string) => {
		switch (status) {
			case "finished":
				return "bg-green-100 text-green-800"
			case "in progress":
				return "bg-amber-100 text-amber-800"
			default:
				return "bg-blue-100 text-blue-800"
		}
	}

	const getDifficultyColor = (cardCount: number) => {
		switch (cardCount) {
			case 12:
				return "bg-green-100 text-green-800"
			case 16:
				return "bg-amber-100 text-amber-800"
			case 24:
				return "bg-red-100 text-red-800"
			default:
				return "bg-blue-100 text-blue-800"
		}
	}

	const getDifficultyLabel = (cardCount: number) => {
		switch (cardCount) {
			case 12:
				return "Easy (12 pairs)"
			case 16:
				return "Medium (16 pairs)"
			case 24:
				return "Hard (24 pairs)"
			default:
				return "Unknown"
		}
	}

	return (
		<Card className="flex flex-col overflow-hidden border-2 border-purple-200 transition-all duration-200 hover:shadow-lg hover:border-purple-300">
			<CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50">
				<div className="flex justify-between items-center">
					<CardTitle className="text-purple-800">{game.title}</CardTitle>
					<Badge variant="outline" className={getStatusColor(game.status)}>{game.status}</Badge>
				</div>
				{/* <CardDescription className="text-purple-600">{game.date}</CardDescription> */}
			</CardHeader>
			<CardContent className="pt-4 flex-1">
				<div className="flex justify-between mb-2">
					<div className="flex items-center">
						<Users className="h-4 w-4 text-purple-500 mr-1" />
						<span className="text-sm">Players: {game.players.length}</span>
					</div>
					<Badge variant="outline" className={getDifficultyColor(game.cardCount)}>
						{getDifficultyLabel(game.cardCount)}
					</Badge>
				</div>
				{game.status === "finished" && (
					<div className="flex items-center mt-2">
						<Trophy className="h-4 w-4 text-amber-500 mr-1" />
						<span className="text-sm text-amber-700">Winner: {game.winner?.name}</span>
					</div>
				)}
				{game.finishedAt && game.startedAt ? (
					<div className="flex items-center mt-2">
						<Timer className="h-4 w-4 text-amber-500 mr-1" />
						<span className="text-sm text-amber-700">{calculateGameDuration(game.startedAt, game.finishedAt)}</span>
					</div>
				) : null}
				{game.status === "finished" && (
					<div className="flex items-center mt-2">
						<Gem className="h-4 w-4 text-amber-500 mr-1" />
						<span className="text-sm text-amber-700">Game score: {game.gameScore}</span>
					</div>
				)}
			</CardContent>
			<CardFooter className="bg-purple-50">
				<div className="flex justify-between items-center pt-4">
					{game.status === "waiting" ? <JoinGameDialog gameId={game.id} /> : <Button onClick={() => router.push(`/game/${game.id}`)}>View Game</Button>}
				</div>
			</CardFooter>
		</Card>
	)
}


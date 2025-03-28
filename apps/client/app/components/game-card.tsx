"use client"

import { useRouter } from "next/navigation";
import { Trophy, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GameState } from "@/types/game.types"
import JoinGameDialog from "./join-game-dialog"

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
			case 18:
				return "bg-amber-100 text-amber-800"
			case 24:
				return "bg-purple-100 text-purple-800"
			default:
				return "bg-blue-100 text-blue-800"
		}
	}

	const getDifficultyLabel = (cardCount: number) => {
		switch (cardCount) {
			case 12:
				return "Easy"
			case 18:
				return "Medium"
			case 24:
				return "Hard"
			default:
				return "Unknown"
		}
	}

	return (
		<Card className="overflow-hidden border-2 border-purple-200 transition-all duration-200 hover:shadow-lg hover:border-purple-300">
			<CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 pb-2">
				<div className="flex justify-between items-start">
					<CardTitle className="text-purple-800">{game.title}</CardTitle>
					<Badge className={getStatusColor(game.status)}>{game.status}</Badge>
				</div>
				{/* <CardDescription className="text-purple-600">{game.date}</CardDescription> */}
			</CardHeader>
			<CardContent className="pt-4">
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
			</CardContent>
			<CardFooter className="bg-purple-50 pt-2">
				{/* <Button
					variant="outline"
					className="w-full border-purple-300 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
				>
					{game.status === "waiting" ? "Join game" : "View Game"}
				</Button> */}
				{game.status === "waiting" ? <JoinGameDialog gameId={game.id} /> : <Button onClick={() => router.push(`/game/${game.id}`)}>View Game</Button>}
			</CardFooter>
		</Card>
	)
}


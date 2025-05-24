import type { DatabaseGame, GameState } from "@memory-game/common"
import { Star } from "lucide-react"
import { calculateRawDuration } from "../utils"
import { Badge } from "@client/components/ui/badge"

interface HighScoreCardProps {
	game: DatabaseGame
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

export function HighScoreCard({ game }: HighScoreCardProps) {
	const { gameScore, winnerId, totalMoves, startedAt, finishedAt } = game
	console.log("Hishest Score Card", game)
	const winnerName = game.players.find((player) => player.id === winnerId)?.name;
	const difficultyLevel = getDifficultyLabel(game.cardCount);
	return (
		<>
			<div className="flex justify-between items-center">
				<span className="text-4xl font-bold text-amber-700">{gameScore}</span>
				<Badge variant="outline" className="bg-amber-200 text-amber-800 border-amber-300 font-medium">
					{difficultyLevel}
				</Badge>
			</div>
			<div className="grid grid-cols-2 gap-y-2 text-sm">
				<span className="text-amber-700 font-medium">Player:</span>
				<span className="text-right font-semibold text-amber-900">{winnerName}</span>

				<span className="text-amber-700">Total Moves:</span>
				<span className="text-right font-semibold text-amber-900">{totalMoves}</span>

				<span className="text-amber-700">Duration:</span>
				{finishedAt && startedAt ? <span className="text-right font-semibold text-amber-900">{`${calculateRawDuration(new Date(startedAt).getTime(), new Date(finishedAt).getTime())}`}</span> : "-"}

				<span className="text-amber-700">Play Mode:</span>
				<span className="text-right font-semibold text-amber-900">{game.players.length === 2 ? "Multi player" : "Single player"}</span>
			</div>
		</>
	)
}
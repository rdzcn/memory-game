import type { DatabaseGame, GameState } from "@memory-game/common"
import { Star } from "lucide-react"
import { calculateRawDuration } from "../utils"

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
	const winnerName = game.players.find((player) => player.id === game.winnerId)?.name;
	const difficultyLevel = getDifficultyLabel(game.cardCount);
	return (
		<div className="w-full max-w-xs">
			<div className="flex items-center gap-2 text-amber-600 mb-2">
				<Star className="h-5 w-5 fill-amber-400 stroke-amber-500" />
				<h3 className="font-medium">Highest Score</h3>
			</div>

			<div className="mt-1">
				<div className="flex justify-between items-center mb-1">
					<span className="text-2xl font-bold text-amber-700">{gameScore}</span>
					<span className="text-sm bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">{difficultyLevel}</span>
				</div>
				<div className="space-y-1 mt-3 text-sm text-amber-700">
					<div className="flex justify-between">
						<span className="text-amber-600">Player:</span>
						<span className="font-medium">{winnerName}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-amber-600">Total Moves:</span>
						<span className="font-medium">{totalMoves}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-amber-600">Duration:</span>
						{finishedAt && startedAt ? <span className="font-medium">{`${calculateRawDuration(new Date(startedAt).getTime(), new Date(finishedAt).getTime())}`}</span> : "-"}
					</div>
					<div className="flex justify-between">
						<span className="text-amber-600">Play Mode:</span>
						<span className="font-medium">{game.players.length === 2 ? "Multi player" : "Single player"}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
import { Users, Trophy, Star, ArrowUp, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@client/components/ui/card"
import { Badge } from "@client/components/ui/badge"
import CreateGameDialog from "./create-game-dialog"
import type { DatabaseGame } from "@memory-game/common";
import { HighScoreCard } from "./highest-score-card";

interface DashboardStatistics {
	highestScoreGame: DatabaseGame;
	gamesCount: number;
}

export default function DashboardStats({ onlineUsers, dashboardStatistics }: { onlineUsers: number, dashboardStatistics: DashboardStatistics }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 w-full">
			<div className="flex flex-col gap-4">
				{/* Players Online Card */}
				<Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
					<CardHeader className="pb-2">
						<CardTitle className="text-blue-600 flex items-center gap-2 text-lg font-medium">
							<Users className="h-5 w-5" />
							Players Online
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-4xl font-bold text-blue-700">{onlineUsers}</p>
							<Badge
								variant="outline"
								className="bg-blue-100 text-blue-700 border-blue-200 font-medium flex items-center gap-1"
							>
								<ArrowUp className="h-3.5 w-3.5" />
								Active
							</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Games Completed Card */}
				<Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
					<CardHeader className="pb-2">
						<CardTitle className="text-purple-600 flex items-center gap-2 text-lg font-medium">
							<Trophy className="h-5 w-5" />
							Games Completed
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-4xl font-bold text-purple-700">{dashboardStatistics.gamesCount}</p>
							<Badge
								variant="outline"
								className="bg-purple-100 text-purple-700 border-purple-200 font-medium flex items-center gap-1"
							>
								<Activity className="h-3.5 w-3.5" />
								All time
							</Badge>
						</div>
					</CardContent>
				</Card>
			</div>
			{/* Highest Score Card */}
			<Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-amber-100">
				<CardHeader className="pb-2">
					<CardTitle className="text-amber-600 flex items-center gap-2 text-lg font-medium">
						<Star className="h-5 w-5 fill-amber-400 text-amber-400" />
						Highest Score
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{dashboardStatistics ? <HighScoreCard game={dashboardStatistics.highestScoreGame} /> : null}
				</CardContent>
			</Card>
			<Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-green-100">
				<CardContent className="grid place-items-center h-full">
					<CreateGameDialog />
				</CardContent>
			</Card>
		</div>
	)
}

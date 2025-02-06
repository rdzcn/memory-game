import { getGameById } from "@/requests/api";
import GameBoard from "./game-board";

export async function fetchGameById(gameId: string) {
	try {
		return getGameById(gameId);
	} catch (error) {
		console.error("Failed to fetch game", error);
		return null;
	}
}

export default async function Page({ params }: { params: { gameId: string } }) {
	const game = await fetchGameById(params.gameId);

	return game ? (
		<div className="grid items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<GameBoard gameData={game} />
		</div>
	) : null;
}

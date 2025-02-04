import { getGames } from "@/api/requests";

export async function fetchGames() {
	return getGames();
}

export default async function Home() {
	const data = await fetchGames();

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				MEMORY GAME CENTRAL
				{data.map((game) => {
					return (
						<div key={game.gameId} className="flex flex-col gap-4">
							{game.players.map((player) => {
								return (
									<div key={player.id} className="flex flex-col gap-2">
										{player.name} - {player.score}
									</div>
								);
							})}
						</div>
					);
				})}
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				{JSON.stringify(data, null, 2)}
			</footer>
		</div>
	);
}

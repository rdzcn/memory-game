import { getGames } from "@/requests/api";
import Games from "./games";

export async function fetchGames() {
	try {
		return getGames();
	} catch (error) {
		console.error("Failed to fetch games", error);
		return [];
	}
}

export default async function Home() {
	const data = await fetchGames();

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<Games initialGames={data} />
			</main>
		</div>
	);
}

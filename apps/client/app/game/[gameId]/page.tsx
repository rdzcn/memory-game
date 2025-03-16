import GameBoard from "./game-board";

export default async function Page({ params }: { params: { gameId: string } }) {
	return (
		<div className="grid items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<GameBoard gameId={params.gameId} />
		</div>
	);
}

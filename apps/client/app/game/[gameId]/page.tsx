import GameBoard from "./game-board";

export default async function Page({ params }: { params: { gameId: string } }) {
	return (
		<div className="grid items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
			<GameBoard gameId={params.gameId} />
		</div>
	);
}

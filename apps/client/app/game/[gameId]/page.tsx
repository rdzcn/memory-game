export default async function Page({ params }: { params: { gameId: string } }) {
	console.log("params", params);
	return (
		<div>
			<h1>Game {params.gameId}</h1>
		</div>
	);
}

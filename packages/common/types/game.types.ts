export interface Player {
	id: string;
	name: string;
	score: number;
}

export interface Game {
	gameId: string;
	gameTitle: string;
	players: Player[];
}

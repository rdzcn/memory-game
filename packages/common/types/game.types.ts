export type GameStatus = "waiting" | "playing" | "finished";

export interface Player {
	id: string;
	name: string;
	score: number;
	isReady?: boolean;
	isOnline?: boolean;
	socketId?: string;
}

export interface GameState {
	title: string;
	players: Player[];
	id: string;
	currentTurn: string;
	status: GameStatus;
}

export interface Card {
	id: number;
	value: string;
	position: number;
	isRevealed: boolean;
	isMatched: boolean;
}

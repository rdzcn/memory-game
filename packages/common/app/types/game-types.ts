export type GameStatus = "waiting" | "playing" | "finished";

export type PlayMode = "single-player" | "multi-player";

export interface Player {
	id: string;
	name: string;
	score: number;
}

export interface GameState {
	title: string;
	players: Player[];
	id: string;
	currentTurn: string;
	status: GameStatus;
	flippedCards: Card[];
	lastFlippedCard: Card | undefined;
	winner: Player | undefined;
	cards: Card[];
	cardCount: number;
	createdAt: number;
	startedAt?: number;
	finishedAt?: number;
	gameScore: number;
	totalMoves: number;
	playMode: PlayMode;
}

export interface Card {
	id: number;
	value: string;
	isFlipped: boolean;
	isMatched: boolean;
}

export interface CardData {
	id: number;
	value: string;
}

export interface PlayerConnection {
	playerId: string;
	gameId: string;
	lastHeartbeat: number;
	missedBeats: number;
	socketId?: string;
}

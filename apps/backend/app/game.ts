import type { GameState, Player } from "@common/types/game.types";

type GameStatus = "waiting" | "playing" | "finished";

export class Game {
	private id: string;
	private players: Player[];
	private flippedCards: { id: string; pairIndex: number }[];
	private currentTurn: string;
	private status: GameStatus;
	private title: string;

	constructor(title: string) {
		this.id = crypto.randomUUID(); // Generate unique game ID
		this.players = [];
		this.currentTurn = "";
		this.status = "waiting";
		this.title = title;
		this.flippedCards = [];
	}

	public addPlayer(player: Player): boolean {
		if (this.players.length >= 2) {
			return false;
		}

		this.players.push(player);

		// If this is the first player, set them as current turn
		if (this.players.length === 1) {
			this.currentTurn = player.id;
		}

		// If we now have 2 players, start the game
		if (this.players.length === 2) {
			this.status = "playing";
		}

		return true;
	}

	public removePlayer(playerId: string): void {
		this.players = this.players.filter((p) => p.id !== playerId);

		// If we're down to 1 or 0 players, reset the game state
		if (this.players.length < 2) {
			this.status = "waiting";
			// this.resetCards();
		}
	}

	// public flipCard(playerId: string, cardId: number): boolean {
	// 	// Validation checks
	// 	if (
	// 		this.status !== "playing" ||
	// 		this.currentTurn !== playerId ||
	// 		this.cards[cardId].isFlipped ||
	// 		this.cards[cardId].isMatched
	// 	) {
	// 		return false;
	// 	}

	// 	const card = this.cards[cardId];
	// 	card.isFlipped = true;

	// 	// If this is the first card flipped
	// 	if (!this.lastFlippedCard) {
	// 		this.lastFlippedCard = card;
	// 		return true;
	// 	}

	// 	// This is the second card
	// 	// Check if it's a match
	// 	if (this.lastFlippedCard.value === card.value) {
	// 		// Match found!
	// 		card.isMatched = true;
	// 		this.lastFlippedCard.isMatched = true;

	// 		// Update score for current player
	// 		const currentPlayer = this.players.find((p) => p.id === playerId);
	// 		if (currentPlayer) {
	// 			currentPlayer.score += 1;
	// 		}

	// 		// Check if game is finished
	// 		if (this.cards.every((c) => c.isMatched)) {
	// 			this.status = "finished";
	// 			this.winner = this.players.reduce((a, b) =>
	// 				a.score > b.score ? a : b,
	// 			);
	// 		}
	// 	} else {
	// 		// No match, cards will be flipped back by the frontend after a delay
	// 		setTimeout(() => {
	// 			card.isFlipped = false;
	// 			if (this.lastFlippedCard) {
	// 				this.lastFlippedCard.isFlipped = false;
	// 			}
	// 		}, 1000);

	// 		// Switch turns
	// 		this.switchTurn();
	// 	}

	// 	// Reset lastFlippedCard
	// 	this.lastFlippedCard = undefined;
	// 	return true;
	// }

	// private switchTurn(): void {
	// 	const currentPlayerIndex = this.players.findIndex(
	// 		(p) => p.id === this.currentTurn,
	// 	);
	// 	const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
	// 	this.currentTurn = this.players[nextPlayerIndex].id;
	// }

	// private resetCards(): void {
	// 	this.cards = this.initializeCards();
	// 	this.lastFlippedCard = undefined;
	// }

	public getState(): GameState {
		return {
			id: this.id,
			players: this.players,
			flippedCards: this.flippedCards,
			currentTurn: this.currentTurn,
			status: this.status,
			// lastFlippedCard: this.lastFlippedCard,
			// winner: this.winner,
			title: this.title,

		};
	}

	public getId(): string {
		return this.id;
	}
}

import type { GameState, Player } from "@common/types/game.types";

type GameStatus = "waiting" | "playing" | "finished";

export class Game {
	private id: string;
	private players: Player[];
	// private cards: Card[];
	private currentTurn: string;
	private status: GameStatus;
	private title: string;
	// private lastFlippedCard?: Card;
	// private winner?: Player;

	constructor(title: string) {
		this.id = crypto.randomUUID(); // Generate unique game ID
		this.players = [];
		// this.cards = this.initializeCards();
		this.currentTurn = "";
		this.status = "waiting";
		this.title = title;
	}

	// private initializeCards(): Card[] {
	// 	// Create pairs of cards (8 pairs = 16 cards total)
	// 	const values = [1, 2, 3, 4, 5, 6, 7, 8];
	// 	const cards: Card[] = [];

	// 	// Create two cards for each value
	// 	for (const value of values) {
	// 		for (let i = 0; i < 2; i++) {
	// 			cards.push({
	// 				id: cards.length,
	// 				value,
	// 				isFlipped: false,
	// 				isMatched: false,
	// 			});
	// 		}
	// 	}

	// 	// Shuffle the cards
	// 	return this.shuffleCards(cards);
	// }

	// private shuffleCards(cards: Card[]): Card[] {
	// 	for (let i = cards.length - 1; i > 0; i--) {
	// 		const j = Math.floor(Math.random() * (i + 1));
	// 		[cards[i], cards[j]] = [cards[j], cards[i]];
	// 	}
	// 	return cards;
	// }

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
			// cards: this.cards,
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

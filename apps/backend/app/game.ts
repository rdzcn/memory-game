import type {
	Card,
	CardData,
	GameState,
	Player,
} from "@common/types/game.types";

type GameStatus = "waiting" | "playing" | "finished";

const cardData: CardData[] = [
	{ id: 0, value: "bioinformatics" },
	{ id: 1, value: "centrifuge" },
	{ id: 2, value: "chip" },
	{ id: 3, value: "experiment" },
	{ id: 4, value: "flask" },
	{ id: 5, value: "gmo" },
	{ id: 6, value: "magnetism" },
	{ id: 7, value: "microscope" },
	{ id: 8, value: "periodic-table" },
	{ id: 9, value: "scientist" },
	{ id: 10, value: "test-tube" },
	{ id: 11, value: "virus" },
];

export class Game {
	private id: string;
	private players: Player[];
	private flippedCards: Card[];
	private currentTurn: string;
	private status: GameStatus;
	private title: string;
	private cards: Card[];
	private lastFlippedCard?: Card;
	private winner?: Player;

	constructor(title: string, skipCardInit?: boolean) {
		this.id = crypto.randomUUID(); // Generate unique game ID
		this.players = [];
		this.currentTurn = "";
		this.status = "waiting";
		this.title = title;
		this.flippedCards = [];
		this.cards = skipCardInit ? [] : this.initializeCards();
		this.lastFlippedCard = undefined;
		this.winner = undefined;
	}

	private initializeCards(): Card[] {
		function swap<T>(array: T[], i: number, j: number) {
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}

		function shuffleCards<T>(array: T[]): T[] {
			const shuffled = [...array];
			for (let i = shuffled.length; i > 0; i--) {
				const randomIndex = Math.floor(Math.random() * i);
				const currIndex = i - 1;
				swap(shuffled, currIndex, randomIndex);
			}
			return shuffled;
		}

		// Create pairs of cards and add game-specific properties
		const cards: Card[] = [];
		let id = 0;

		// Create two of each card
		for (const baseCard of cardData) {
			for (let i = 0; i < 2; i++) {
				cards.push({
					id: id++,
					value: baseCard.value,
					isFlipped: false,
					isMatched: false,
				});
			}
		}

		// Shuffle the cards
		return shuffleCards(cards);
	}

	public restoreState(state: GameState): void {
		// Restore basic properties
		this.id = state.id;
		this.players = state.players;
		this.currentTurn = state.currentTurn;
		this.status = state.status;
		this.title = state.title;
		this.flippedCards = state.flippedCards;

		// If cards aren't in the saved state, initialize new ones
		if (state.cards && state.cards.length > 0) {
			this.cards = state.cards;
		} else {
			this.cards = this.initializeCards();
		}

		// Reset game-specific properties if in waiting state
		if (this.status === "waiting") {
			this.lastFlippedCard = undefined;
			this.winner = undefined;
			this.resetCards();
		}

		// Validate the restored state
		this.validateState();
	}

	private validateState(): void {
		// Ensure we have valid players
		if (!Array.isArray(this.players)) {
			this.players = [];
		}

		// Ensure we have valid cards
		if (!Array.isArray(this.cards)) {
			this.cards = this.initializeCards();
		}

		// Ensure we have a valid current turn
		if (this.players.length > 0 && !this.currentTurn) {
			this.currentTurn = this.players[0].id;
		}

		// Ensure we have a valid status
		if (!["waiting", "playing", "finished"].includes(this.status)) {
			this.status = "waiting";
		}

		// Ensure we have a valid flippedCards array
		if (!Array.isArray(this.flippedCards)) {
			this.flippedCards = [];
		}
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

	public flipCard({ playerId, id }: { playerId: string; id: number }): boolean {
		// Validation checks
		const cardIndex = this.cards.findIndex((card) => card.id === id);

		if (cardIndex === -1) {
			return false; // Card not found
		}
		if (
			this.status !== "playing" ||
			this.currentTurn !== playerId ||
			this.cards[cardIndex].isFlipped ||
			this.cards[cardIndex].isMatched
		) {
			return false;
		}

		const card = this.cards[cardIndex];
		card.isFlipped = true;
		this.flippedCards.push(card);

		// If this is the first card flipped
		if (!this.lastFlippedCard) {
			this.lastFlippedCard = card;
			return true;
		}

		// This is the second card
		// Check if it's a match
		if (this.lastFlippedCard.value === card.value) {
			// Match found!
			card.isMatched = true;
			this.lastFlippedCard.isMatched = true;

			// Update score for current player
			const currentPlayer = this.players.find((p) => p.id === playerId);
			if (currentPlayer) {
				currentPlayer.score += 1;
			}

			this.flippedCards = [];

			// Check if game is finished
			if (this.cards.every((c) => c.isMatched)) {
				this.status = "finished";
				this.winner = this.players.reduce((a, b) =>
					a.score > b.score ? a : b,
				);
			}
		}
		this.lastFlippedCard = undefined;
		return true;
	}

	switchTurn(): void {
		const currentPlayerIndex = this.players.findIndex(
			(p) => p.id === this.currentTurn,
		);
		const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
		this.currentTurn = this.players[nextPlayerIndex].id;
		const flippedCardIds = this.flippedCards.map((c) => c.id);
		for (const card of this.cards) {
			if (flippedCardIds.includes(card.id)) {
				card.isFlipped = false;
			}
		}
		this.flippedCards = [];
	}

	private resetCards(): void {
		this.cards = this.initializeCards();
		this.lastFlippedCard = undefined;
	}

	public getState(): GameState {
		return {
			id: this.id,
			players: this.players,
			flippedCards: this.flippedCards,
			currentTurn: this.currentTurn,
			status: this.status,
			lastFlippedCard: this.lastFlippedCard,
			winner: this.winner,
			title: this.title,
			cards: this.cards,
		};
	}

	public getId(): string {
		return this.id;
	}
}

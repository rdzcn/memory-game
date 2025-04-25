import crypto from "node:crypto";
import type {
	Card,
	CardData,
	GameState,
	Player,
	PlayMode,
} from "@memory-game/common";
import { saveGame } from "@memory-game/database";

type GameStatus = "waiting" | "playing" | "finished";

const cardData: CardData[] = [
	{ id: 0, value: "bulbasaur" },
	{ id: 1, value: "caterpie" },
	{ id: 2, value: "chansey" },
	{ id: 3, value: "charmander" },
	{ id: 4, value: "clefairy" },
	{ id: 5, value: "cubone" },
	{ id: 6, value: "farfetchd" },
	{ id: 7, value: "squirtle" },
	{ id: 8, value: "hitmonchan" },
	{ id: 9, value: "scyther" },
	{ id: 10, value: "seadra" },
	{ id: 11, value: "weezing" },
	{ id: 12, value: "tentacruel" },
	{ id: 13, value: "graveler" },
	{ id: 14, value: "golem" },
	{ id: 15, value: "ponyta" },
	{ id: 16, value: "slowpoke" },
	{ id: 17, value: "cloyster" },
	{ id: 18, value: "drowzee" },
	{ id: 19, value: "lickitung" },
	{ id: 20, value: "rhydon" },
	{ id: 21, value: "goldeen" },
	{ id: 22, value: "starmie" },
	{ id: 23, value: "mr-mime" },
];

export class Game {
	private id: string;
	private players: Player[];
	private flippedCards: Card[];
	private currentTurn: string;
	private status: GameStatus;
	private title: string;
	private cards: Card[];
	private cardCount: number;
	private createdAt: number;
	private gameScore: number;
	private startedAt?: number;
	private finishedAt?: number;
	private lastFlippedCard?: Card;
	private winner?: Player;
	private totalMoves: number;

	constructor(title: string, cardCount: number, skipCardInit?: boolean) {
		this.id = crypto.randomUUID(); // Generate unique game ID
		this.players = [];
		this.currentTurn = "";
		this.status = "waiting";
		this.cardCount = cardCount;
		this.title = title;
		this.flippedCards = [];
		this.cards = skipCardInit ? [] : this.initializeCards();
		this.lastFlippedCard = undefined;
		this.winner = undefined;
		this.createdAt = Date.now();
		this.startedAt = undefined;
		this.finishedAt = undefined;
		this.gameScore = 0;
		this.totalMoves = 0;
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

		const selectedCards = [...cardData].sort(() => Math.random() - 0.5);
		const finalCardData = selectedCards.slice(0, this.cardCount);

		// Create two of each card
		for (const baseCard of finalCardData) {
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
		this.winner = state.winner;
		this.createdAt = state.createdAt;
		this.startedAt = state.startedAt;
		this.finishedAt = state.finishedAt;
		this.cardCount = state.cardCount;
		this.lastFlippedCard = state.lastFlippedCard;
		this.gameScore = state.gameScore;
		this.totalMoves = state.totalMoves;

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

	private calculateGameScore(): number {
		const baseScore = 1000;
		const difficultyMultiplier = this.cardCount / 12;
		const optimalMoves = this.cardCount * 2;
		const optimalityFactor = optimalMoves / this.totalMoves;
		const durationInMs =
			this.finishedAt && this.startedAt ? this.finishedAt - this.startedAt : 0;
		const timeFactor = durationInMs / 1000;

		const rawScore =
			(baseScore * difficultyMultiplier * optimalityFactor * 10) / timeFactor;
		return Math.round(rawScore);
	}

	private async saveFinishedGame(): Promise<void> {
		console.log("Saving finished game to database...");
		try {
			await saveGame(this.getState());
		} catch (error) {
			console.error("Error saving game:", error);
		}
	}

	public addPlayer(player: Player, playMode: PlayMode): boolean {
		if (this.players.length >= 2) {
			return false;
		}

		this.players.push(player);

		// If this is the first player, set them as current turn
		if (this.players.length === 1) {
			this.currentTurn = player.id;
		}

		// If we now have 2 players, start the game
		if (this.players.length === 2 || playMode === "single-player") {
			this.startedAt = Date.now();
			this.status = "playing";
		}

		return true;
	}

	public removePlayer(playerId: string): void {
		this.players = this.players.filter((p) => p.id !== playerId);

		// If we're down to 1 or 0 players, reset the game state
		if (this.players.length < 2) {
			this.status = "waiting";
			this.startedAt = undefined;
		}
	}

	public flipCard({ playerId, id }: { playerId: string; id: number }): boolean {
		const cardIndex = this.cards.findIndex((card) => card.id === id);

		if (cardIndex === -1) {
			return false; // Card not found
		}

		// Validation checks
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
		this.totalMoves++;

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
				this.finishedAt = Date.now();
				this.winner = this.players.reduce((a, b) =>
					a.score > b.score ? a : b,
				);
				this.gameScore = this.calculateGameScore();

				// save the game in the database
				this.saveFinishedGame();
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
			cardCount: this.cardCount,
			createdAt: this.createdAt,
			startedAt: this.startedAt,
			finishedAt: this.finishedAt,
			totalMoves: this.totalMoves,
			gameScore: this.gameScore,
		};
	}

	public getId(): string {
		return this.id;
	}
}

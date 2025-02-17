type Card = {
	pairIndex: number;
	name: string;
	isFlipped: boolean;
	isMatched: boolean;
};

type GameState = {
	status: "idle" | "waiting" | "playing" | "finished";
	players: string[];
	currentPlayer: string;
	cards: Card[];
	flippedCards: Card[];
	score: Record<string, number>;
	error?: string;
};

type GameAction =
	| { type: "START_GAME"; payload: { players: string[] } }
	| { type: "FLIP_CARD"; payload: { cardId: number } }
	| { type: "MATCH_CARDS" }
	| { type: "NEXT_TURN" }
	| { type: "GAME_OVER" }
	| { type: "SYNC_STATE"; payload: GameState }
	| { type: "SET_ERROR"; payload: string };

// gameReducer.ts
const gameReducer = (state: GameState, action: GameAction): GameState => {
	switch (action.type) {
		case "START_GAME":
			return {
				...state,
				status: "playing",
				players: action.payload.players,
				currentPlayer: action.payload.players[0],
				score: action.payload.players.reduce(
					(acc, player) => Object.assign(acc, { [player]: 0 }),
					{},
				),
			};

		case "FLIP_CARD": {
			if (state.flippedCards.length >= 2) return state;

			const flippedCard = state.cards.find(
				(card) => card.pairIndex === action.payload.cardId,
			);
			if (!flippedCard || flippedCard.isMatched) return state;

			const updatedCards = state.cards.map((card) =>
				card.pairIndex === action.payload.cardId
					? { ...card, isFlipped: true }
					: card,
			);

			return {
				...state,
				cards: updatedCards,
				flippedCards: [...state.flippedCards, flippedCard],
			};
		}

		case "MATCH_CARDS": {
			const [card1, card2] = state.flippedCards;
			const isMatch = card1.name === card2.name;

			return {
				...state,
				cards: state.cards.map((card) =>
					state.flippedCards.some((fc) => fc.pairIndex === card.pairIndex)
						? { ...card, isMatched: isMatch, isFlipped: false }
						: card,
				),
				flippedCards: [],
				score: isMatch
					? {
							...state.score,
							[state.currentPlayer]: state.score[state.currentPlayer] + 1,
						}
					: state.score,
			};
		}

		case "NEXT_TURN": {
			const currentPlayerIndex = state.players.indexOf(state.currentPlayer);
			const nextPlayerIndex = (currentPlayerIndex + 1) % state.players.length;

			return {
				...state,
				currentPlayer: state.players[nextPlayerIndex],
			};
		}

		case "SYNC_STATE":
			return action.payload;

		case "SET_ERROR":
			return {
				...state,
				error: action.payload,
			};

		default:
			return state;
	}
};

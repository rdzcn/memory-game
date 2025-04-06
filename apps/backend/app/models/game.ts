import mongoose, { Schema, type Document } from "mongoose";

// Card Interface
interface ICard {
	id: number;
	value: string;
	isFlipped: boolean;
	isMatched: boolean;
}

// Player Interface
interface IPlayer {
	id: string;
	name: string;
	score: number;
	isReady?: boolean;
	isOnline?: boolean;
	socketId?: string;
}

// GameState Interface with Document extension for Mongoose
export interface IGameState extends Document {
	title: string;
	players: IPlayer[];
	id: string;
	currentTurn: string;
	status: "waiting" | "playing" | "finished";
	flippedCards: ICard[];
	lastFlippedCard?: ICard;
	winner?: IPlayer;
	cards: ICard[];
	cardCount: number;
	createdAt: number;
	startedAt?: number;
	finishedAt?: number;
}

// Card Schema
const CardSchema = new Schema<ICard>(
	{
		id: { type: Number, required: true },
		value: { type: String, required: true },
		isFlipped: { type: Boolean, required: true },
		isMatched: { type: Boolean, required: true },
	},
	{ _id: false },
);

// Player Schema
const PlayerSchema = new Schema<IPlayer>(
	{
		id: { type: String, required: true },
		name: { type: String, required: true },
		score: { type: Number, required: true },
		isReady: { type: Boolean },
		isOnline: { type: Boolean },
		socketId: { type: String },
	},
	{ _id: false },
);

// Game Schema
const GameSchema = new Schema<IGameState>({
	title: { type: String, required: true },
	players: [PlayerSchema],
	id: { type: String, required: true },
	currentTurn: { type: String, required: true },
	status: {
		type: String,
		required: true,
		enum: ["waiting", "playing", "finished"],
	},
	flippedCards: [CardSchema],
	lastFlippedCard: { type: CardSchema },
	winner: { type: PlayerSchema },
	cards: [CardSchema],
	cardCount: { type: Number, required: true },
	createdAt: { type: Number, required: true },
	startedAt: { type: Number },
	finishedAt: { type: Number },
});

// Set the MongoDB collection to use
export default mongoose.model<IGameState>("Game", GameSchema);

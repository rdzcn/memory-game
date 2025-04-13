import dotenv from "dotenv";
dotenv.config();

import type { GameState, Player } from "./types/game.types";

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	const client = new PrismaClient();

	// Only use Accelerate in production
	if (
		process.env.NODE_ENV === "production" &&
		process.env.PRISMA_ACCELERATE_URL
	) {
		const { withAccelerate } = require("@prisma/extension-accelerate");
		return client.$extends(withAccelerate());
	}

	return client;
};

// Use global to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function saveGame(gameState: GameState) {
	console.log("Saving game to database...");
	try {
		const {
			id,
			title,
			status,
			cardCount,
			players,
			winner,
			createdAt,
			startedAt,
			finishedAt,
			gameScore,
			totalMoves,
		} = gameState;

		// Create game and connect players in a transaction
		const savedGame = await prisma.game.create({
			data: {
				id,
				title,
				status,
				cardCount,
				winnerId: winner?.id,
				createdAt: new Date(createdAt),
				startedAt: startedAt ? new Date(startedAt) : undefined,
				finishedAt: finishedAt ? new Date(finishedAt) : undefined,
				gameScore,
				totalMoves,
				players: {
					create: players.map((player: Player) => ({
						id: player.id,
						name: player.name,
						score: player.score,
					})),
				},
			},
			include: {
				players: true,
			},
		});

		console.log("Game saved successfully to database");
		return savedGame;
	} catch (error) {
		console.error("Error saving game:", error);
		throw error;
	}
}

// Update to use string IDs
async function getGameById(id: string) {
	return await prisma.game.findUnique({
		where: { id },
		include: { players: true },
	});
}

async function getAllGames() {
	return await prisma.game.findMany({
		include: { players: true },
		orderBy: { createdAt: "desc" },
	});
}

async function getHighestScoreGame() {
	return await prisma.game.findFirst({
		orderBy: {
			gameScore: "desc",
		},
		include: {
			players: true,
		},
	});
}

export { prisma, saveGame, getGameById, getAllGames, getHighestScoreGame };

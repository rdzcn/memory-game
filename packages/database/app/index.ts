import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import type { GameState, Player } from "./types/game.types";

dotenv.config();
const prisma = new PrismaClient();

// Helper functions
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

export { prisma, saveGame, getGameById, getAllGames };

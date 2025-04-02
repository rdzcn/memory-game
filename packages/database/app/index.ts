import { PrismaClient } from "@prisma/client";
import type { GameState } from "./types/game.types";

const prisma = new PrismaClient();

// Helper functions
export async function saveGame(gameState: GameState) {
	return await prisma.game.create({
		data: {
			gameId: gameState.id,
			title: gameState.title,
			player1Name: gameState.players[0]?.name || "",
			player2Name: gameState.players[1]?.name || "",
			player1Score: gameState.players[0]?.score || 0,
			player2Score: gameState.players[1]?.score || 0,
			winner: gameState.winner?.name || "",
			cardCount: gameState.cardCount,
			createdAt: gameState.createdAt,
			updatedAt: gameState.updatedAt || gameState.createdAt,
			finishedAt: gameState.finishedAt || gameState.createdAt,
		},
	});
}

export async function getGameById(gameId: string) {
	return await prisma.game.findUnique({
		where: { gameId },
	});
}

export async function getAllGames() {
	return await prisma.game.findMany({
		orderBy: { createdAt: "desc" },
	});
}

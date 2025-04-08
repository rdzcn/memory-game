/*
  Warnings:

  - Added the required column `gameScore` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMoves` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "gameScore" INTEGER NOT NULL,
ADD COLUMN     "totalMoves" INTEGER NOT NULL;

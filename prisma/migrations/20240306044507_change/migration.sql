/*
  Warnings:

  - Added the required column `accuracy` to the `TypingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TypingHistory" ADD COLUMN     "accuracy" INTEGER NOT NULL;

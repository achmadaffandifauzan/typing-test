/*
  Warnings:

  - You are about to drop the `Quote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `allTypedChar` to the `TypingHistory` table without a default value. This is not possible if the table is not empty.
  - Made the column `wrongCharacters` on table `TypingHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_typingHistoryId_fkey";

-- AlterTable
ALTER TABLE "TypingHistory" ADD COLUMN     "allTypedChar" VARCHAR(500) NOT NULL,
ALTER COLUMN "wrongCharacters" SET NOT NULL;

-- DropTable
DROP TABLE "Quote";

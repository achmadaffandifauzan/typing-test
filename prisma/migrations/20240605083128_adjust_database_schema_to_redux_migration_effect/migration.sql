/*
  Warnings:

  - You are about to drop the column `allTypedChar` on the `TypingHistory` table. All the data in the column will be lost.
  - The `wrongCharacters` column on the `TypingHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TypingHistory" DROP COLUMN "allTypedChar",
ADD COLUMN     "quotes" JSONB,
DROP COLUMN "wrongCharacters",
ADD COLUMN     "wrongCharacters" JSONB;

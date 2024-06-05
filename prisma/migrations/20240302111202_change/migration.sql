/*
  Warnings:

  - The `wrongCharacters` column on the `TypingHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `allTypedChar` column on the `TypingHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TypingHistory" DROP COLUMN "wrongCharacters",
ADD COLUMN     "wrongCharacters" VARCHAR(500)[],
DROP COLUMN "allTypedChar",
ADD COLUMN     "allTypedChar" VARCHAR(300)[];

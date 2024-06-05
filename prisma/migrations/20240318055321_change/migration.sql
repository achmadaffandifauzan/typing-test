/*
  Warnings:

  - You are about to alter the column `wrongCharacters` on the `TypingHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(500)`.
  - You are about to alter the column `allTypedChar` on the `TypingHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(300)` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "TypingHistory" ALTER COLUMN "wrongCharacters" SET NOT NULL,
ALTER COLUMN "wrongCharacters" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "allTypedChar" SET NOT NULL,
ALTER COLUMN "allTypedChar" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "accuracy" SET DATA TYPE DOUBLE PRECISION;

/*
  Warnings:

  - The primary key for the `TypingHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `result` on the `TypingHistory` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `TypingHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `authorId` on the `TypingHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `new_table` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `wpm` to the `TypingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `TypingHistory_authorId_idx` ON `TypingHistory`;

-- AlterTable
ALTER TABLE `TypingHistory` DROP PRIMARY KEY,
    DROP COLUMN `result`,
    ADD COLUMN `wpm` INTEGER NOT NULL,
    ADD COLUMN `wrongCharacters` VARCHAR(500) NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `authorId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `new_table`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(25) NULL,
    `name` VARCHAR(25) NULL,
    `email` VARCHAR(25) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quoteString` VARCHAR(300) NOT NULL,
    `typingHistoryId` INTEGER NOT NULL,

    UNIQUE INDEX `Quote_typingHistoryId_key`(`typingHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TypingHistory` ADD CONSTRAINT `TypingHistory_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_typingHistoryId_fkey` FOREIGN KEY (`typingHistoryId`) REFERENCES `TypingHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

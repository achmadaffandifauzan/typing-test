-- CreateTable
CREATE TABLE `TypingHistory` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorId` VARCHAR(191) NOT NULL,
    `result` VARCHAR(191) NOT NULL,

    INDEX `TypingHistory_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `new_table` (
    `idnew_table` INTEGER NOT NULL,
    `new_tablecol` VARCHAR(45) NULL,
    `new_tablecol1` VARCHAR(45) NULL,

    PRIMARY KEY (`idnew_table`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

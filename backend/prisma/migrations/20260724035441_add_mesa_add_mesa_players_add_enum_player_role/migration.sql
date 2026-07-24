-- CreateTable
CREATE TABLE `mesas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `mesas_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MesaPlayers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mesaId` INTEGER NOT NULL,
    `role` ENUM('MASTER', 'PLAYER', 'SPECTATOR') NOT NULL DEFAULT 'PLAYER',
    `userCharacterId` INTEGER NULL,
    `joinedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MesaPlayers_userId_mesaId_key`(`userId`, `mesaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mesas` ADD CONSTRAINT `mesas_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MesaPlayers` ADD CONSTRAINT `MesaPlayers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MesaPlayers` ADD CONSTRAINT `MesaPlayers_mesaId_fkey` FOREIGN KEY (`mesaId`) REFERENCES `mesas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MesaPlayers` ADD CONSTRAINT `MesaPlayers_userCharacterId_fkey` FOREIGN KEY (`userCharacterId`) REFERENCES `user_character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

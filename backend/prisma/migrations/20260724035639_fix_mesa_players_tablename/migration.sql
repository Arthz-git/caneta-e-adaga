/*
  Warnings:

  - You are about to drop the `mesaplayers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `mesaplayers` DROP FOREIGN KEY `MesaPlayers_mesaId_fkey`;

-- DropForeignKey
ALTER TABLE `mesaplayers` DROP FOREIGN KEY `MesaPlayers_userCharacterId_fkey`;

-- DropForeignKey
ALTER TABLE `mesaplayers` DROP FOREIGN KEY `MesaPlayers_userId_fkey`;

-- DropTable
DROP TABLE `mesaplayers`;

-- CreateTable
CREATE TABLE `mesa_players` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mesaId` INTEGER NOT NULL,
    `role` ENUM('MASTER', 'PLAYER', 'SPECTATOR') NOT NULL DEFAULT 'PLAYER',
    `userCharacterId` INTEGER NULL,
    `joinedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mesa_players_userId_mesaId_key`(`userId`, `mesaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mesa_players` ADD CONSTRAINT `mesa_players_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mesa_players` ADD CONSTRAINT `mesa_players_mesaId_fkey` FOREIGN KEY (`mesaId`) REFERENCES `mesas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mesa_players` ADD CONSTRAINT `mesa_players_userCharacterId_fkey` FOREIGN KEY (`userCharacterId`) REFERENCES `user_character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

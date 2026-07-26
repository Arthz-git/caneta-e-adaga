/*
  Warnings:

  - Added the required column `updatedAt` to the `mesa_players` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mesa_players` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

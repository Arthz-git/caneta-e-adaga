/*
  Warnings:

  - Added the required column `name` to the `user_character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_character` ADD COLUMN `name` VARCHAR(191) NOT NULL;

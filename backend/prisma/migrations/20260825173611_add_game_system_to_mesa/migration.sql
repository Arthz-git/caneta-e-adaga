-- CreateEnum
CREATE TYPE "GameSystem" AS ENUM ('DND5E', 'VAMPIRO_A_MASCARA', 'LIVRE');

-- AlterTable
ALTER TABLE "mesas" ADD COLUMN "gameSystem" "GameSystem";

-- Backfill existing rows before enforcing NOT NULL
UPDATE "mesas" SET "gameSystem" = 'LIVRE' WHERE "gameSystem" IS NULL;

-- AlterTable
ALTER TABLE "mesas" ALTER COLUMN "gameSystem" SET NOT NULL;

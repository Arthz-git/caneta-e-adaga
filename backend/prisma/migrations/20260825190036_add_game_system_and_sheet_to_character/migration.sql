-- AlterTable
ALTER TABLE "characters" ADD COLUMN "gameSystem" "GameSystem";
ALTER TABLE "characters" ADD COLUMN "sheet" JSONB;

-- Backfill existing rows before enforcing NOT NULL
UPDATE "characters" SET "gameSystem" = 'LIVRE' WHERE "gameSystem" IS NULL;

-- AlterTable
ALTER TABLE "characters" ALTER COLUMN "gameSystem" SET NOT NULL;

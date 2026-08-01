-- AlterTable
ALTER TABLE "mesas" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

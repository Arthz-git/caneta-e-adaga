-- AlterTable
ALTER TABLE "mesas" ADD COLUMN     "allowSpectators" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxPlayers" INTEGER NOT NULL DEFAULT 4;

-- CreateTable
CREATE TABLE "character_sheet_history" (
    "id" SERIAL NOT NULL,
    "userCharacterId" INTEGER NOT NULL,
    "changedById" INTEGER NOT NULL,
    "previousSheet" JSONB,
    "newSheet" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_sheet_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "character_sheet_history_userCharacterId_idx" ON "character_sheet_history"("userCharacterId");

-- AddForeignKey
ALTER TABLE "character_sheet_history" ADD CONSTRAINT "character_sheet_history_userCharacterId_fkey" FOREIGN KEY ("userCharacterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_sheet_history" ADD CONSTRAINT "character_sheet_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

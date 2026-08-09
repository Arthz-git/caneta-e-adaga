-- CreateTable
CREATE TABLE "post_visible_players" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "post_visible_players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_visible_players_postId_playerId_key" ON "post_visible_players"("postId", "playerId");

-- AddForeignKey
ALTER TABLE "post_visible_players" ADD CONSTRAINT "post_visible_players_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_visible_players" ADD CONSTRAINT "post_visible_players_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

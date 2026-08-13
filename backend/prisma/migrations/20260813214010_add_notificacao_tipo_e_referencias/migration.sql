-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM ('SOLICITACAO_RECEBIDA', 'SOLICITACAO_ACEITA', 'SOLICITACAO_RECUSADA', 'NOVO_POST_MESA', 'POST_PRIVADO');

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" SERIAL NOT NULL,
    "destinoId" INTEGER NOT NULL,
    "remetenteId" INTEGER,
    "tipo" "TipoNotificacao" NOT NULL,
    "message" TEXT NOT NULL,
    "solicitacaoId" INTEGER,
    "mesaId" INTEGER,
    "postId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notificacoes_destinoId_idx" ON "notificacoes"("destinoId");

-- CreateIndex
CREATE INDEX "notificacoes_destinoId_readAt_idx" ON "notificacoes"("destinoId", "readAt");

-- CreateIndex
CREATE INDEX "notificacoes_solicitacaoId_idx" ON "notificacoes"("solicitacaoId");

-- CreateIndex
CREATE INDEX "notificacoes_mesaId_idx" ON "notificacoes"("mesaId");

-- CreateIndex
CREATE INDEX "notificacoes_postId_idx" ON "notificacoes"("postId");

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_remetenteId_fkey" FOREIGN KEY ("remetenteId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "solicitacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "mesas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "MotivoSolicitacao" AS ENUM ('PEDIDO_AMIZADE', 'CONVITE_MESA', 'PEDIDO_ENTRADA_MESA');

-- CreateEnum
CREATE TYPE "StatusSolicitacao" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "solicitacoes" (
    "id" SERIAL NOT NULL,
    "solicitanteId" INTEGER NOT NULL,
    "destinoId" INTEGER NOT NULL,
    "mesaId" INTEGER,
    "motivo" "MotivoSolicitacao" NOT NULL,
    "status" "StatusSolicitacao" NOT NULL DEFAULT 'PENDENTE',
    "respostaSolicitacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "solicitacoes_solicitanteId_idx" ON "solicitacoes"("solicitanteId");

-- CreateIndex
CREATE INDEX "solicitacoes_destinoId_idx" ON "solicitacoes"("destinoId");

-- CreateIndex
CREATE INDEX "solicitacoes_mesaId_idx" ON "solicitacoes"("mesaId");

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "mesas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

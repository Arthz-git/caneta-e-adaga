/*
  Warnings:

  - The values [PEDIDO_ENTRADA_MESA] on the enum `MotivoSolicitacao` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MotivoSolicitacao_new" AS ENUM ('PEDIDO_AMIZADE', 'CONVITE_MESA', 'PEDIDO_ENTRADA_MESA_ESPECTADOR', 'PEDIDO_ENTRADA_MESA_JOGADOR');
ALTER TABLE "solicitacoes" ALTER COLUMN "motivo" TYPE "MotivoSolicitacao_new" USING ("motivo"::text::"MotivoSolicitacao_new");
ALTER TYPE "MotivoSolicitacao" RENAME TO "MotivoSolicitacao_old";
ALTER TYPE "MotivoSolicitacao_new" RENAME TO "MotivoSolicitacao";
DROP TYPE "public"."MotivoSolicitacao_old";
COMMIT;

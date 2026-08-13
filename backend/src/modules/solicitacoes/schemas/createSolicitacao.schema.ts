import { z } from 'zod'

export const createSolicitacaoSchema = z.object({
	destinoId: z
		.coerce
		.number('Id do destinatário inválido')
		.positive('Id do destinatário inválido'),
	mesaId: z
		.coerce
		.number('Id da mesa inválido')
		.positive('Id da mesa inválido')
		.optional(),
	motivo: z.enum(['PEDIDO_AMIZADE', 'CONVITE_MESA', 'PEDIDO_ENTRADA_MESA_JOGADOR', 'PEDIDO_ENTRADA_MESA_ESPECTADOR'], 'Motivo inválido')
}).refine(
	data => data.motivo === 'PEDIDO_AMIZADE' || !!data.mesaId,
	{ message: 'O id da mesa é obrigatório para este motivo', path: ['mesaId'] }
)

export type CreateSolicitacaoInput = z.infer<typeof createSolicitacaoSchema>
export type CreateSolicitacaoDTO = CreateSolicitacaoInput & { solicitanteId: number }

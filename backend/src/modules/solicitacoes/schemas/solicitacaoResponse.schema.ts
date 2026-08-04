import { z } from 'zod'

export const solicitacaoResponseSchema = z.object({
	id: z.number(),
	motivo: z.enum(['PEDIDO_AMIZADE', 'CONVITE_MESA', 'PEDIDO_ENTRADA_MESA']),
	status: z.enum(['PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA']),
	respostaSolicitacao: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	solicitante: z.object({
		id: z.number(),
		name: z.string()
	}),
	destino: z.object({
		id: z.number(),
		name: z.string()
	}),
	mesa: z.object({
		id: z.number(),
		title: z.string()
	}).nullable()
})

export type SolicitacaoResponseRepository = z.infer<typeof solicitacaoResponseSchema>
export type SolicitacaoResponseDTO = z.infer<typeof solicitacaoResponseSchema>

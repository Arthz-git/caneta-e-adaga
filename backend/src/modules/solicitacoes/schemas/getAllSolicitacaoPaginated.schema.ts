import { z } from 'zod'

export const getAllSolicitacaoPaginatedSchema = z.object({
	page: z
		.coerce
		.number('a página deve ser um número')
		.int('a página deve ser um número inteiro')
		.positive('a página deve ser positiva')
		.default(1),
	limit: z
		.coerce
		.number('o limite deve ser um número')
		.int('o limite deve ser um número inteiro')
		.positive('o limite deve ser positivo')
		.max(50, 'o limite máximo é 50')
		.default(10),
	status: z.enum(['PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA'], 'Status inválido').optional(),
	motivo: z.enum(['PEDIDO_AMIZADE', 'CONVITE_MESA', 'PEDIDO_ENTRADA_MESA'], 'Motivo inválido').optional()
})

export type GetAllSolicitacaoPaginatedDTO = z.infer<typeof getAllSolicitacaoPaginatedSchema>

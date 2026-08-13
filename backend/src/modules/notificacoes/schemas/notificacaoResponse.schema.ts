import { z } from 'zod'

export const notificacaoResponseSchema = z.object({
	id: z.number(),
	tipo: z.enum(['SOLICITACAO_RECEBIDA', 'SOLICITACAO_ACEITA', 'SOLICITACAO_RECUSADA', 'NOVO_POST_MESA', 'POST_PRIVADO', 'JOGADOR_REMOVIDO_MESA', 'MESA_EXCLUIDA']),
	message: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	readAt: z.date().nullable(),
	destino: z.object({
		id: z.number(),
		name: z.string()
	}),
	remetente: z.object({
		id: z.number(),
		name: z.string()
	}).nullable(),
	solicitacao: z.object({
		id: z.number(),
		motivo: z.string()
	}).nullable(),
	mesa: z.object({
		id: z.number(),
		title: z.string()
	}).nullable(),
	post: z.object({
		id: z.number()
	}).nullable()
})

export type NotificacaoResponseRepository = z.infer<typeof notificacaoResponseSchema>
export type NotificacaoResponseDTO = z.infer<typeof notificacaoResponseSchema>

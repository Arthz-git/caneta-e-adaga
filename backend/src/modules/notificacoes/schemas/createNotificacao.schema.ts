import { z } from 'zod'

export const createNotificacaoSchema = z.object({
	destinoId: z.number('Id do destinatário inválido').positive('Id do destinatário inválido'),
	remetenteId: z.number('Id do remetente inválido').positive('Id do remetente inválido').optional(),
	tipo: z.enum(['SOLICITACAO_RECEBIDA', 'SOLICITACAO_ACEITA', 'SOLICITACAO_RECUSADA', 'NOVO_POST_MESA', 'POST_PRIVADO', 'JOGADOR_REMOVIDO_MESA', 'MESA_EXCLUIDA', 'LEMBRETE_JOGADA'], 'Tipo inválido'),
	message: z.string('Mensagem inválida').min(1, 'Mensagem é obrigatória'),
	solicitacaoId: z.number('Id da solicitação inválido').positive('Id da solicitação inválido').optional(),
	mesaId: z.number('Id da mesa inválido').positive('Id da mesa inválido').optional(),
	postId: z.number('Id do post inválido').positive('Id do post inválido').optional()
})

export type CreateNotificacaoDTO = z.infer<typeof createNotificacaoSchema>

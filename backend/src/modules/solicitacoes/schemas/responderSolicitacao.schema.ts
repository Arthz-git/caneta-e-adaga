import { z } from 'zod'

export const responderSolicitacaoSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido'),
	status: z.enum(['ACEITA', 'RECUSADA'], 'Status inválido'),
	respostaSolicitacao: z
		.string('A resposta inválida')
		.max(100, 'A resposta deve ter no máximo 100 caracteres')
		.optional()
})

export type ResponderSolicitacaoDTO = z.infer<typeof responderSolicitacaoSchema>

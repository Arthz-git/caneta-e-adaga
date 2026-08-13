import { z } from 'zod'

export const responderSolicitacaoSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido'),
	status: z.enum(['ACEITA', 'RECUSADA'], 'Status inválido')
})

export type ResponderSolicitacaoDTO = z.infer<typeof responderSolicitacaoSchema>

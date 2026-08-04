import { z } from 'zod'

export const getSolicitacaoSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type GetSolicitacaoDTO = z.infer<typeof getSolicitacaoSchema>

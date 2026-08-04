import { z } from 'zod'

export const deleteSolicitacaoSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type DeleteSolicitacaoDTO = z.infer<typeof deleteSolicitacaoSchema>

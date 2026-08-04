import { z } from 'zod'

export const cancelarSolicitacaoSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type CancelarSolicitacaoDTO = z.infer<typeof cancelarSolicitacaoSchema>

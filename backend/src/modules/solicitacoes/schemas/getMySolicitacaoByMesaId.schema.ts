import { z } from 'zod'

export const getMySolicitacaoByMesaIdSchema = z.object({
	mesaId: z
		.coerce
		.number('Id da mesa inválido')
		.positive('Id da mesa inválido')
})

export type GetMySolicitacaoByMesaIdDTO = z.infer<typeof getMySolicitacaoByMesaIdSchema>

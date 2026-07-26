import { z } from 'zod'

export const getPlayersByMesaIdSchema = z.object({
	mesaId: z
		.coerce
		.number('Id da mesa inválido')
		.positive('Id da mesa inválido')
})

export type GetPlayersByMesaIdDTO = z.infer<typeof getPlayersByMesaIdSchema>

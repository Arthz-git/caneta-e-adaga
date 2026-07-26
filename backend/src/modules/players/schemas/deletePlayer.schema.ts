import { z } from 'zod'

export const deletePlayerSchema = z.object({
	id: z
		.coerce
		.number('Id da mesa inválido')
		.positive('Id da mesa inválido')
})

export type DeletePlayerDTO = z.infer<typeof deletePlayerSchema>

import { z } from 'zod'

export const getAmizadeSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type GetAmizadeDTO = z.infer<typeof getAmizadeSchema>

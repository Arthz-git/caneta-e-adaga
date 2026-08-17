import { z } from 'zod'

export const deleteAmizadeSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type DeleteAmizadeDTO = z.infer<typeof deleteAmizadeSchema>

import { z } from 'zod'

export const createAmizadeSchema = z.object({
	amigoId: z
		.coerce
		.number('Id do amigo inválido')
		.positive('Id do amigo inválido')
})

export type CreateAmizadeInput = z.infer<typeof createAmizadeSchema>
export type CreateAmizadeDTO = CreateAmizadeInput & { userId: number }

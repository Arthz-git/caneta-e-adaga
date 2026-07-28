import { z } from 'zod'

export const userCharacterResponseSchema = z.object({
	id: z.number(),
	userId: z.number(),
	name: z.string(),
	description: z.string(),
	lore: z.string(),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type UserCharacterResponseDTO = z.infer<typeof userCharacterResponseSchema>

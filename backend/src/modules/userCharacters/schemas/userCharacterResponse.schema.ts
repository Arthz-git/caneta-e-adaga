import { z } from 'zod'

export const userCharacterResponseSchema = z.object({
	id: z.number(),
	userId: z.number(),
	name: z.string(),
	description: z.string(),
	lore: z.string(),
	imageUrl: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type UserCharacterResponseDTO = z.infer<typeof userCharacterResponseSchema>

export const userCharacterWithLinkResponseSchema = userCharacterResponseSchema.extend({
	linkedMesaId: z.number().nullable(),
	linkedMesaTitle: z.string().nullable()
})

export type UserCharacterWithLinkResponseDTO = z.infer<typeof userCharacterWithLinkResponseSchema>

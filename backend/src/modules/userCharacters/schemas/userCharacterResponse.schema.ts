import { z } from 'zod'
import { gameSystemValues } from '../../../shared/constants/gameSystems'

export const userCharacterResponseSchema = z.object({
	id: z.number(),
	userId: z.number(),
	name: z.string(),
	description: z.string(),
	lore: z.string(),
	imageUrl: z.string().nullable(),
	gameSystem: z.enum(gameSystemValues),
	sheet: z.record(z.string(), z.unknown()).nullable(),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type UserCharacterResponseDTO = z.infer<typeof userCharacterResponseSchema>

export const userCharacterWithLinkResponseSchema = userCharacterResponseSchema.extend({
	linkedMesaId: z.number().nullable(),
	linkedMesaTitle: z.string().nullable()
})

export type UserCharacterWithLinkResponseDTO = z.infer<typeof userCharacterWithLinkResponseSchema>

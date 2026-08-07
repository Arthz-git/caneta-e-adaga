import { z } from 'zod'

const postBaseSchema = z.object({
	id: z
		.number(),
	userId: z
		.number(),
	mesaId: z
		.number(),
	text: z
		.string(),
	type: z
		.enum(['CHARACTER', 'NARRATOR', 'NPC', 'SYSTEM', 'OOC']),
	characterId: z
		.number()
		.nullable(),
	npcName: z
		.string()
		.nullable(),
	createdAt: z
		.date(),
	updatedAt: z
		.date()
})

export const postCreateResponseSchema = postBaseSchema

export const postResponseSchema = postBaseSchema.extend({
	author: z.object({
		id: z.number(),
		name: z.string()
	}),
	character: z.object({
		id: z.number(),
		name: z.string(),
		imageUrl: z.string().nullable()
	}).nullable()
})

export type PostCreateResponseDTO = z.infer<typeof postCreateResponseSchema>
export type PostResponseRepository = z.infer<typeof postResponseSchema>
export type PostResponseDTO = z.infer<typeof postResponseSchema>

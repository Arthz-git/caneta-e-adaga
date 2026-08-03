import { z } from 'zod'

export const mesaResponseSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	isPrivate: z.boolean(),
	allowSpectators: z.boolean(),
	maxPlayers: z.number(),
	imageUrl: z.string().nullable(),
	creator: z.object({
		id: z.number(),
		name: z.string()
	}),
	countSpectators: z.number(),
	countPlayers: z.number()
})

export const mesaResponseRepository = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	createdBy: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	isPrivate: z.boolean(),
	allowSpectators: z.boolean(),
	maxPlayers: z.number(),
	imageUrl: z.string().nullable(),
	creator: z.object({
		name: z.string()
	}),
	players: z.array(z.object({
		id: z.number(),
		userId: z.number(),
		mesaId: z.number(),
		role: z.enum(['MASTER', 'PLAYER', 'SPECTATOR']),
		userCharacterId: z.number().nullable(),
		joinedAt: z.date(),
		updatedAt: z.date(),
		isFavorite: z.boolean()
	}))
})

export type MesaResponseRepository= z.infer<typeof mesaResponseRepository>
export type MesaResponseDTO = z.infer<typeof mesaResponseSchema>

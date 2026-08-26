import { z } from 'zod'
import { gameSystemValues } from '../../../shared/constants/gameSystems'

export const mesaResponseSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	gameSystem: z.enum(gameSystemValues),
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
	countPlayers: z.number(),
	isMember: z.boolean(),
	lastPostAt: z.date().nullable()
})

export const mesaResponseRepository = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	gameSystem: z.enum(gameSystemValues),
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
	posts: z.array(z.object({
		createdAt: z.date()
	})).optional(),
	players: z.array(z.object({
		id: z.number(),
		userId: z.number(),
		user: z.object({
			name: z.string()
		}).optional(),
		mesaId: z.number(),
		role: z.enum(['MASTER', 'PLAYER', 'SPECTATOR']),
		userCharacterId: z.number().nullable(),
		userCharacter: z.object({
			name: z.string(),
			imageUrl: z.string().nullable()
		}).nullable().optional(),
		joinedAt: z.date(),
		updatedAt: z.date(),
		isFavorite: z.boolean()
	}))
})

export type MesaResponseRepository= z.infer<typeof mesaResponseRepository>
export type MesaResponseDTO = z.infer<typeof mesaResponseSchema>

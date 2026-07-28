import { z } from 'zod'

export const playerResponseSchema = z.object({
	id: z.number(),
	userId: z.number(),
	mesaId: z.number(),
	role: z.enum(['MASTER', 'PLAYER', 'SPECTATOR']),
	userCharacterId: z.number().nullable(),
	joinedAt: z.date(),
	updatedAt: z.date()
})

export type PlayerResponseDTO = z.infer<typeof playerResponseSchema>

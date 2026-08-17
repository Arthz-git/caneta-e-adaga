import { z } from 'zod'

export const amizadeResponseSchema = z.object({
	id: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userA: z.object({
		id: z.number(),
		name: z.string()
	}),
	userB: z.object({
		id: z.number(),
		name: z.string()
	})
})

export type AmizadeResponseRepository = z.infer<typeof amizadeResponseSchema>
export type AmizadeResponseDTO = z.infer<typeof amizadeResponseSchema>

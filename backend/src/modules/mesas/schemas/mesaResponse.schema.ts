import { z } from 'zod'

export const mesaResponseSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	createdBy: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	creator: z.object({
		id: z.number(),
		name: z.string()
	}),
	_count: z.object({
		players: z.number()
	})
})

export type MesaResponseDTO = z.infer<typeof mesaResponseSchema>

import { z } from 'zod'

export const mesaResponseSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	createdBy: z.number(),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type MesaResponseDTO = z.infer<typeof mesaResponseSchema>

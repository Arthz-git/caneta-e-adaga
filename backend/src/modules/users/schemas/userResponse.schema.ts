import { z } from 'zod'

export const userResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.email(),
	role: z.number(),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type UserResponseDTO = z.infer<typeof userResponseSchema>

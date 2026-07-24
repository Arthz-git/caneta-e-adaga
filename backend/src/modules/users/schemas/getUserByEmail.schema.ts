import { z } from 'zod'

export const getUserByEmailSchema = z.object({
	email: z
		.email({ error: 'O e-mail é inválido' })
		.trim()
		.toLowerCase()
})

export type GetUserByEmailDTO = z.infer<typeof getUserByEmailSchema>
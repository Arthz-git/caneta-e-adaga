import { z } from 'zod'

export const findUserByEmailSchema = z.object({
	email: z
		.email({ error: 'O e-mail é inválido' })
		.trim()
		.toLowerCase()
})

export type FindUserByEmailDTO = z.infer<typeof findUserByEmailSchema>
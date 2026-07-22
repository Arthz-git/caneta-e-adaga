import { z } from 'zod'

export const loginSchema = z.object({
	email: z
		.email({ error: 'O e-mail é inválido' })
		.trim()
		.toLowerCase(),
	password: z
		.string({ error: 'A senha é obrigatória' })
		.min(1, 'A senha é obrigatória')
})

export type LoginDTO = z.infer<typeof loginSchema>

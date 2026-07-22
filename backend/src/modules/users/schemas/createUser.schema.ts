import { z } from 'zod'

export const createUserSchema = z.object({
	name: z
		.string({ error: 'O nome é obrigatório' })
		.trim()
		.min(2, 'O nome deve ter no mínimo 2 caracteres')
		.max(100, 'O nome deve ter no máximo 100 caracteres'),
	email: z
		.email({ error: 'O e-mail é inválido' })
		.trim()
		.toLowerCase(),
	password: z
		.string({ error: 'A senha é obrigatória' })
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula')
		.regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
		.regex(/[0-9]/, 'A senha deve conter ao menos um número')
		.regex(/[^a-zA-Z0-9]/, 'A senha deve conter ao menos um caractere especial')
})

export type CreateUserDTO = z.infer<typeof createUserSchema>

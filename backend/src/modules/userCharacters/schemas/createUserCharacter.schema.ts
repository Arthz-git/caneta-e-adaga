import { z } from 'zod'

export const createUserCharacterSchema = z.object({
	name: z
		.string({ error: 'Nome é um campo obrigatório' })
		.trim()
		.min(1),
	description: z
		.string({ error: 'Descrição é um campo obrigatório' })
		.trim()
		.min(1, 'Descrição é um campo obrigatório'),
	lore: z
		.string({ error: 'História é um campo obrigatório' })
		.trim()
		.min(1, 'História é um campo obrigatório')
})

export type CreateUserCharacterInput = z.infer<typeof createUserCharacterSchema>
export type CreateUserCharacterDTO = CreateUserCharacterInput & { userId: number, imageUrl?: string }

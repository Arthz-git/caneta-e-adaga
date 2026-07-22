import { z } from 'zod'

export const createUserCharacterSchema = z.object({
	name: z
		.string({ error: 'Nome é um campo obrigatório' }),
	description: z
		.string({ error: 'Descrição é um campo obrigatório ' }),
	lore: z
		.string({ error: 'História é um campo obrigatório ' })
})

export type CreateUserCharacterInput = z.infer<typeof createUserCharacterSchema>
export type CreateUserCharacterDTO = CreateUserCharacterInput & { userId: number }

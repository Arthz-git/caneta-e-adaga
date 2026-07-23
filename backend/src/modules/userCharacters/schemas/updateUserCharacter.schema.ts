import { z } from 'zod'

export const updateUserCharacterSchema = z.object({
	id: z
		.coerce
		.number({ error: 'Id de registro inválido' })
		.int({ error: 'Id de registro inválido' })
		.positive({ error: 'Id de registro inválido' }),
	name: z
		.string({ error: 'Nome é um campo obrigatório' }),
	description: z
		.string({ error: 'Descrição é um campo obrigatório ' }),
	lore: z
		.string({ error: 'História é um campo obrigatório ' })
})

export type UpdateUserCharacterDTO = z.infer<typeof updateUserCharacterSchema>
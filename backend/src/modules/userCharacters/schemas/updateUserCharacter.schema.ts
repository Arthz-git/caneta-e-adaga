import { z } from 'zod'
import { sheetSchema } from './createUserCharacter.schema'

export const updateUserCharacterSchema = z.object({
	id: z
		.coerce
		.number({ error: 'Id de registro inválido' })
		.int({ error: 'Id de registro inválido' })
		.positive({ error: 'Id de registro inválido' }),
	name: z
		.string({ error: 'Nome é um campo obrigatório' })
		.trim()
		.min(1, 'Nome é um campo obrigatório'),
	description: z
		.string({ error: 'Descrição é um campo obrigatório ' })
		.trim()
		.min(1, 'Descrição é um campo obrigatório'),
	lore: z
		.string({ error: 'História é um campo obrigatório ' })
		.trim()
		.min(1, 'História é um campo obrigatório'),
	sheet: sheetSchema
})

export type UpdateUserCharacterDTO = z.infer<typeof updateUserCharacterSchema> & { imageUrl?: string }
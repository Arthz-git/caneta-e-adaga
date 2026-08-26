import { z } from 'zod'
import { gameSystemValues } from '../../../shared/constants/gameSystems'

export const sheetSchema = z.preprocess((value) => {
	if (typeof value !== 'string') return value

	try {
		return JSON.parse(value)
	}
	catch {
		return value
	}
}, z.record(z.string(), z.union([z.string(), z.number()])).optional())

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
		.min(1, 'História é um campo obrigatório'),
	gameSystem: z.enum(gameSystemValues, 'Sistema de jogo inválido'),
	sheet: sheetSchema
})

export type CreateUserCharacterInput = z.infer<typeof createUserCharacterSchema>
export type CreateUserCharacterDTO = CreateUserCharacterInput & { userId: number, imageUrl?: string }

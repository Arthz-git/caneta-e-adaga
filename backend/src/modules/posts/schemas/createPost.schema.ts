import { z } from 'zod'

export const createPostSchema = z.object({
	mesaId: z
		.coerce
		.number('Id da mesa inválido')
		.positive('Id da mesa inválido'),
	text: z
		.string({ error: 'Texto é um campo obrigatório' })
		.trim()
		.min(1, 'Texto é um campo obrigatório'),
	type: z
		.enum(['CHARACTER', 'NARRATOR', 'SCENE', 'NPC', 'SYSTEM', 'OOC'], 'Tipo inválido'),
	characterId: z
		.coerce
		.number()
		.positive()
		.nullable()
		.optional(),
	npcName: z
		.string()
		.trim()
		.min(1)
		.nullable()
		.optional(),
	visiblePlayerIds: z
		.array(z.coerce.number().positive())
		.min(1, 'Selecione ao menos um jogador')
		.optional()
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreatePostDTO = CreatePostInput & { userId: number }

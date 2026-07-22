import { z } from 'zod'

export const findUserByIdSchema = z.object({
	id: z.coerce
		.number({ error: 'O id é obrigatório' })
		.int('O id deve ser um número inteiro')
		.positive('O id deve ser positivo')
})

export type FindUserByIdDTO = z.infer<typeof findUserByIdSchema>
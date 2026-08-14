import { z } from 'zod'

export const getAllMesaPaginatedSchema = z.object({
	page: z
		.coerce
		.number('a página deve ser um número')
		.int('a página deve ser um número inteiro')
		.positive('a página deve ser positiva')
		.default(1),
	limit: z
		.coerce
		.number('o limite deve ser um número')
		.int('o limite deve ser um número inteiro')
		.positive('o limite deve ser positivo')
		.max(50, 'o limite máximo é 50')
		.default(10),
	search: z
		.string()
		.trim()
		.min(1)
		.optional(),
	mine: z
		.coerce
		.boolean()
		.optional()
})

export type GetAllMesaPaginatedDTO = z.infer<typeof getAllMesaPaginatedSchema>

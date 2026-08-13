import { z } from 'zod'

export const getAllNotificacaoPaginatedSchema = z.object({
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
	apenasNaoLidas: z
		.enum(['true', 'false'], 'apenasNaoLidas inválido')
		.transform(value => value === 'true')
		.optional()
})

export type GetAllNotificacaoPaginatedDTO = z.infer<typeof getAllNotificacaoPaginatedSchema>

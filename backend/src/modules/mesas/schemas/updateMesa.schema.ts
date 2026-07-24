import { z } from 'zod'

export const updateMesaSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido'),
	title: z
		.string('O título inválido')
		.min(2, 'O título muito pequeno')
		.max(100, 'O título deve ter no máximo 100 caracteres'),
	description: z
		.string('A descrição inválida')
		.min(2, 'A descrição muito pequeno')
		.max(400, 'A descrição deve ter no máximo 400 caracteres')
})

export type UpdateMesaDTO = z.infer<typeof updateMesaSchema>

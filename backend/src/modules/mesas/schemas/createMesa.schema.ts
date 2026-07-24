import { z } from 'zod'

export const createMesaSchema = z.object({
	title: z
		.string('O título inválido')
		.min(2, 'O título muito pequeno')
		.max(100, 'O título deve ter no máximo 100 caracteres'),
	description: z
		.string('A descrição inválida')
		.min(2, 'A descrição muito pequeno')
		.max(400, 'A descrição deve ter no máximo 400 caracteres')
})

export type CreateMesaInput = z.infer<typeof createMesaSchema>
export type CreateMesaDTO = CreateMesaInput & { createdBy: number }

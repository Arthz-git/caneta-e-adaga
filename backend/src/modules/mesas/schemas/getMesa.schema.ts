import { z } from 'zod'

export const getMesaSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type GetMesaDTO = z.infer<typeof getMesaSchema>

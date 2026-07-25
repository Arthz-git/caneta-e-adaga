import { z } from 'zod'

export const getMesaPlayerSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type GetMesaPlayerDTO = z.infer<typeof getMesaPlayerSchema>

import { z } from 'zod'

export const deleteMesaPlayerSchema = z.object({
	id: z
		.coerce
		.number('Id da mesa inválido')
		.positive('Id da mesa inválido')
})

export type DeleteMesaPlayerDTO = z.infer<typeof deleteMesaPlayerSchema>

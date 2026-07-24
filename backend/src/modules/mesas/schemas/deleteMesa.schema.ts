import { z } from 'zod'

export const deleteMesaSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type DeleteMesaDTO = z.infer<typeof deleteMesaSchema>

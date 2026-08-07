import { z } from 'zod'

export const getAllPostsByMesaIdSchema = z.object({
	mesaId: z
		.coerce
		.number('Id da mesa inválido')
		.positive('Id da mesa inválido')
})

export type GetAllPostsByMesaIdDTO = z.infer<typeof getAllPostsByMesaIdSchema>

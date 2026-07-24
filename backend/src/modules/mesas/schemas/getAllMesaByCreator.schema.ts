import { z } from 'zod'

export const getAllMesaByCreatorSchema = z.object({
	createdBy: z
		.coerce
		.number('o id do usuário é inválido')
		.positive('o id do usuário é inválido')
})

export type GetAllMesaByCreatorDTO = z.infer<typeof getAllMesaByCreatorSchema>

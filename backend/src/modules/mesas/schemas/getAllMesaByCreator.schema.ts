import { z } from 'zod'

export const getAllMesaByCreatorSchema = z.object({
	createdBy: z
		.coerce
		.number('Id do usuário inválido')
		.positive('Id do usuário inválido')
})

export type GetAllMesaByCreatorDTO = z.infer<typeof getAllMesaByCreatorSchema>

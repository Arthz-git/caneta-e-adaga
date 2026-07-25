import { z } from 'zod'

export const updateCharacterMesaPlayerSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido'),
	userCharacterId: z
		.coerce
		.number()
		.positive()
})

export type UpdateCharacterMesaPlayerDTO = z.infer<typeof updateCharacterMesaPlayerSchema>

import { z } from 'zod'

export const updateCharacterPlayerSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido'),
	userCharacterId: z
		.coerce
		.number()
		.positive()
})

export type UpdateCharacterPlayerDTO = z.infer<typeof updateCharacterPlayerSchema>

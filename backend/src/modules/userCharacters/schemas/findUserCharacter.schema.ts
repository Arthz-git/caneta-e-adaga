import { z } from 'zod'

export const findUserCharacterSchema = z.object({
	id: z
		.coerce
		.number({ error: 'Id de registro inválido' })
		.int({ error: 'Id de registro inválido' })
		.positive({ error: 'Id de registro inválido' })
})

export type FindUserCharacterDTO = z.infer<typeof findUserCharacterSchema>
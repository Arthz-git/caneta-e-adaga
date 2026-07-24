import { z } from 'zod'

export const getUserCharacterSchema = z.object({
	id: z
		.coerce
		.number({ error: 'Id de registro inválido' })
		.int({ error: 'Id de registro inválido' })
		.positive({ error: 'Id de registro inválido' })
})

export type GetUserCharacterDTO = z.infer<typeof getUserCharacterSchema>
import { z } from 'zod'

export const findAllUserCharacterByUserIdSchema = z.object({
	userId: z
		.coerce
		.number({ error: 'Id de registro inválido' })
		.int({ error: 'Id de registro inválido' })
		.positive({ error: 'Id de registro inválido' })
})

export type FindAllUserCharacterByUserIdDTO = z.infer<typeof findAllUserCharacterByUserIdSchema>
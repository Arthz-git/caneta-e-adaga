import { z } from 'zod'

export const devTokenSchema = z.object({
	email: z
		.email({ error: 'O e-mail é inválido' })
		.trim()
		.toLowerCase()
})

export type DevTokenDTO = z.infer<typeof devTokenSchema>

import { z } from 'zod'

export const logoutSchema = z.object({
	refreshToken: z
		.string({ error: 'O refresh token é obrigatório' })
		.min(1, 'O refresh token é obrigatório')
})

export type LogoutDTO = z.infer<typeof logoutSchema>

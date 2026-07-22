import { z } from 'zod'

export const createRefreshTokenSchema = z.object({
	userId: z
		.coerce
		.number()
		.positive(),
	tokenHash: z
		.string(),
	expiresAt: z
		.coerce
		.date(),
})

export type CreateRefreshTokenDTO = z.infer<typeof createRefreshTokenSchema>
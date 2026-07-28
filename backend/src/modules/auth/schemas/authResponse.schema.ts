import { z } from 'zod'
import { userResponseSchema } from '../../users/schemas/userResponse.schema'

export const authResponseSchema = z.object({
	user: userResponseSchema,
	accessToken: z.string()
})

export type AuthResponseDTO = z.infer<typeof authResponseSchema>

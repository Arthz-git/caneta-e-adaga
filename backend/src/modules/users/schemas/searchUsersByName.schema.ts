import { z } from 'zod'

export const searchUsersByNameSchema = z.object({
	name: z
		.string('O nome é obrigatório')
		.trim()
		.min(1, 'O nome é obrigatório')
})

export type SearchUsersByNameDTO = z.infer<typeof searchUsersByNameSchema>

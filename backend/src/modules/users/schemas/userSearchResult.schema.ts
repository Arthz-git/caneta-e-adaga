import { z } from 'zod'

export const userSearchResultSchema = z.object({
	id: z.number(),
	name: z.string()
})

export type UserSearchResultDTO = z.infer<typeof userSearchResultSchema>

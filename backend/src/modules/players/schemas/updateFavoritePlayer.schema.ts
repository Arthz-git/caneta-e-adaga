import { z } from 'zod'

export const updateFavoritePlayerSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido'),
	isFavorite: z
		.coerce
		.boolean('Favorito é inválido')
})

export type UpdateFavoritePlayerDTO = z.infer<typeof updateFavoritePlayerSchema>

import { z } from 'zod'

export const notifyPlayerSchema = z.object({
	id: z
		.coerce
		.number('Id do jogador inválido')
		.positive('Id do jogador inválido')
})

export type NotifyPlayerDTO = z.infer<typeof notifyPlayerSchema>

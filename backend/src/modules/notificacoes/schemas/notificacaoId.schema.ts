import { z } from 'zod'

export const notificacaoIdSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido')
})

export type NotificacaoIdDTO = z.infer<typeof notificacaoIdSchema>

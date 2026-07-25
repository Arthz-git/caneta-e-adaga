import { z } from 'zod'

export const createMesaPlayerSchema = z.object({
	userId: z
		.coerce
		.number('Id do usuário inválido')
		.positive('Id do usuário inválido'),
	mesaId: z
		.coerce
		.number('Id da mesa inválido')
		.positive('Id da mesa inválido'),
	role: z
		.enum(['MASTER', 'PLAYER', 'SPECTATOR'], 'A função é inválida'),
	userCharacterId: z
		.coerce
		.number()
		.positive()
		.nullable()
})

export type CreateMesaPlayerDTO = z.infer<typeof createMesaPlayerSchema>

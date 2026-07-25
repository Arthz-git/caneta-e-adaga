import { z } from 'zod'

export const updateRoleMesaPlayerSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido'),
	role: z
		.enum(['MASTER', 'PLAYER', 'SPECTATOR'], 'Função inválida')
})

export type UpdateRoleMesaPlayerDTO = z.infer<typeof updateRoleMesaPlayerSchema>

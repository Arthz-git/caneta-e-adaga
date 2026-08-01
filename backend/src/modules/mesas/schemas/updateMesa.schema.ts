import { z } from 'zod'

export const updateMesaSchema = z.object({
	id: z
		.coerce
		.number('Id do registro inválido')
		.positive('Id do registro inválido'),
	title: z
		.string('O título inválido')
		.min(2, 'O título muito pequeno')
		.max(100, 'O título deve ter no máximo 100 caracteres'),
	description: z
		.string('A descrição inválida')
		.min(2, 'A descrição muito pequeno')
		.max(400, 'A descrição deve ter no máximo 400 caracteres'),
	isPrivate: z
		.coerce
		.boolean('Campo Privado inválido'),
	allowSpectators: z
		.coerce
		.boolean('Campo permitir espectadores é inválido'),
	maxPlayers: z
		.coerce
		.number('Número máximo de jogadores inválido')
		.int('Número máximo de jogadores deve ser um número inteiro')
		.min(1, 'A mesa deve permitir no mínimo 1 jogador')
		.max(20, 'A mesa deve permitir no máximo 20 jogadores')
})

export type UpdateMesaDTO = z.infer<typeof updateMesaSchema>

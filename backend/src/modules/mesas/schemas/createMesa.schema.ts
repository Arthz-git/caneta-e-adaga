import { z } from 'zod'
import { gameSystemValues } from '../../../shared/constants/gameSystems'

export const createMesaSchema = z.object({
	gameSystem: z.enum(gameSystemValues, 'Sistema de jogo inválido'),
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
		.boolean('Campo privado é inválido'),
	allowSpectators: z
		.coerce
		.boolean('Campo permitir espectadores é inválido')
		.default(true),
	maxPlayers: z
		.coerce
		.number('Número máximo de jogadores inválido')
		.int('Número máximo de jogadores deve ser um número inteiro')
		.min(1, 'A mesa deve permitir no mínimo 1 jogador')
		.max(20, 'A mesa deve permitir no máximo 20 jogadores')
		.default(4),
})

export type CreateMesaInput = z.infer<typeof createMesaSchema>
export type CreateMesaDTO = CreateMesaInput & { createdBy: number, imageUrl?: string }

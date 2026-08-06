import { AppError } from '../../../shared/errors/AppError'
import { IPlayersRepository } from '../../players/repositories/IPlayersRepository'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import { GetMesaDTO } from '../schemas/getMesa.schema'

export class GetMesaService {
	constructor(private mesasRepository: IMesasRepository) { }

	async execute(data: GetMesaDTO, userId: number) {
		const mesa = await this.mesasRepository.get(data.id)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		const player = mesa.players.find(player => player.userId === userId)

		if (
			!player &&
			mesa.isPrivate === true
		) {
			throw new AppError('Você não tem permissão para visualizar esse recurso', 403)
		}

		return mesa
	}
}

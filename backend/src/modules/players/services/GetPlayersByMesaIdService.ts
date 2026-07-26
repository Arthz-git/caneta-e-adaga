import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IPlayersRepository } from '../repositories/IPlayersRepository'
import type { GetPlayersByMesaIdDTO } from '../schemas/getPlayersByMesaId.schema'

export class GetPlayersByMesaIdService {
	constructor(
		private playersRepository: IPlayersRepository,
		private mesasRepository: IMesasRepository
	) { }

	async execute(data: GetPlayersByMesaIdDTO, userId: number) {
		const mesa = await this.mesasRepository.get(data.mesaId)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		const allPlayers = await this.playersRepository.getPlayersByMesaId(data.mesaId)

		const playerFound = allPlayers.find(item => item.userId === userId)

		// verifica se o usuário que está fazendo a requisição está na mesa que solicitou.
		if (!playerFound) {
			throw new AppError('Você não tem permissão para acessar este recurso', 403)
		}

		return allPlayers
	}
}
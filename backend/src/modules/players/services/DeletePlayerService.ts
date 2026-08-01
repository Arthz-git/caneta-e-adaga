import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IPlayersRepository } from '../repositories/IPlayersRepository'
import type { DeletePlayerDTO } from '../schemas/deletePlayer.schema'

export class DeletePlayerService {
	constructor(
		private playersRepository: IPlayersRepository,
		private mesasRepository: IMesasRepository
	) { }

	async execute(data: DeletePlayerDTO, userId: number) {
		const player = await this.playersRepository.get(data.id)

		if (!player) {
			throw new AppError('Registro não encontrado', 404)
		}

		const mesa = await this.mesasRepository.get(player.mesaId)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		if (
			mesa.createdBy !== userId &&
			player.userId !== userId
		) {
			throw new AppError('Você não tem permissão para remover jogadores dessa mesa', 403)
		}

		await this.playersRepository.delete(data.id)

		const playersFromThisMesa = await this.playersRepository.getPlayersByMesaId(mesa.id)
		if (playersFromThisMesa.length === 0) {
			await this.mesasRepository.delete(mesa.id)
		}
	}
}
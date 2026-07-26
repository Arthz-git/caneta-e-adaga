import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IPlayersRepository } from '../repositories/IPlayersRepository'
import type { UpdateRolePlayerDTO } from '../schemas/updateRolePlayer.schema'

export class UpdateRolePlayerService {
	constructor(
			private playersRepository: IPlayersRepository,
			private mesasRepository: IMesasRepository
		) { }

	async execute(data: UpdateRolePlayerDTO, userId: number) {
		const player = await this.playersRepository.get(data.id)

		if (!player) {
			throw new AppError('Registro não encontrado', 404)
		}

		const mesa = await this.mesasRepository.get(player.mesaId)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		if (
			player.userId !== userId &&
			mesa.createdBy !== userId
		) {
			throw new AppError('Você não tem permissão para atualizar este registro', 403)
		}

		return await this.playersRepository.updateRole(data)
	}
}
import { AppError } from '../../../shared/errors/AppError'
import type { IMesaPlayersRepository } from '../repositories/IMesaPlayersRepository'
import type { UpdateRoleMesaPlayerDTO } from '../schemas/updateRoleMesaPlayer.schema'

export class UpdateRoleMesaPlayerService {
	constructor(private mesaPlayersRepository: IMesaPlayersRepository) { }

	async execute(data: UpdateRoleMesaPlayerDTO, userId: number) {
		const exists = await this.mesaPlayersRepository.get(data.id)

		if (!exists) {
			throw new AppError('Registro não encontrado', 404)
		}

		if (exists.userId !== userId) {
			throw new AppError('Você não tem permissão para atualizar este registro', 403)
		}

		return await this.mesaPlayersRepository.updateRole(data)
	}
}
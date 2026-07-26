import { AppError } from '../../../shared/errors/AppError'
import type { IPlayersRepository } from '../repositories/IPlayersRepository'
import type { UpdateCharacterPlayerDTO } from '../schemas/updateCharacterPlayer.schema'

export class UpdateCharacterPlayerService {
	constructor(private playersRepository: IPlayersRepository) { }

	async execute(data: UpdateCharacterPlayerDTO, userId: number) {
		const player = await this.playersRepository.get(data.id)

		if (!player) {
			throw new AppError('Registro não encontrado', 404)
		}

		if (player.userId !== userId) {
			throw new AppError('Você não tem permissão para atualizar este registro', 403)
		}

		return await this.playersRepository.updateCharacter(data)
	}
}
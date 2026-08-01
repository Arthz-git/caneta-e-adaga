import { AppError } from '../../../shared/errors/AppError'
import type { IPlayersRepository } from '../repositories/IPlayersRepository'
import { UpdateFavoritePlayerDTO } from '../schemas/updateFavoritePlayer.schema'

export class UpdateFavoritePlayerService {
	constructor(private playersRepository: IPlayersRepository) { }

	async execute(data: UpdateFavoritePlayerDTO, userId: number) {
		const player = await this.playersRepository.get(data.id)

		if (!player) {
			throw new AppError('Registro não encontrado', 404)
		}

		if (player.userId !== userId) {
			throw new AppError('Você não tem permissão para atualizar este registro', 403)
		}

		return await this.playersRepository.updateFavorite(data)
	}
}
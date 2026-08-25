import { AppError } from '../../../shared/errors/AppError'
import type { IUserCharactersRepository } from '../../userCharacters/repositories/IUserCharactersRepository'
import type { IPlayersRepository } from '../repositories/IPlayersRepository'
import type { UpdateCharacterPlayerDTO } from '../schemas/updateCharacterPlayer.schema'

export class UpdateCharacterPlayerService {
	constructor(
		private playersRepository: IPlayersRepository,
		private userCharactersRepository: IUserCharactersRepository
	) { }

	async execute(data: UpdateCharacterPlayerDTO, userId: number) {
		const player = await this.playersRepository.get(data.id)

		if (!player) {
			throw new AppError('Registro não encontrado', 404)
		}

		if (player.userId !== userId) {
			throw new AppError('Você não tem permissão para atualizar este registro', 403)
		}

		if (data.userCharacterId === null) {
			return await this.playersRepository.updateCharacter(data)
		}

		const character = await this.userCharactersRepository.get(data.userCharacterId)
		if (!character) {
			throw new AppError('Personagem não encontrado', 404)
		}

		if (character.userId !== userId) {
			throw new AppError('Personagem não pertence ao usuário', 403)
		}

		const jaVinculado = await this.playersRepository.getByUserCharacterId(data.userCharacterId)
		if (jaVinculado && jaVinculado.id !== player.id) {
			throw new AppError('Este personagem já está vinculado a outra mesa', 409)
		}

		return await this.playersRepository.updateCharacter(data)
	}
}
import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IUserCharactersRepository } from '../../userCharacters/repositories/IUserCharactersRepository'
import type { IUsersRepository } from '../../users/repositories/IUsersRepository'
import type { IPlayersRepository } from '../repositories/IPlayersRepository'
import type { CreatePlayerDTO } from '../schemas/createPlayer.schema'

export class CreatePlayerService {
	constructor(
		private playersRepository: IPlayersRepository,
		private usersRepository: IUsersRepository,
		private mesasRepository: IMesasRepository,
		private userCharactersRepository: IUserCharactersRepository
	) { }

	async execute(data: CreatePlayerDTO, userId: number) {
		// verificação de usuário existente
		const user = await this.usersRepository.get(data.userId)
		if (!user) {
			throw new AppError('Usuário não encontrado', 404)
		}

		// verificação de mesa existente
		const mesa = await this.mesasRepository.get(data.mesaId)
		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		// verificação: Dono e o próprio usuário são os únicos que podem adicionar jogadores
		if (
			mesa.createdBy !== userId && // não é o dono
			data.userId !== userId // não está adicionando a si mesmo
		) {
			throw new AppError('Você não tem permissão para adicionar jogadores nessa mesa', 403)
		}

		if (data.userCharacterId) {
			// verificação de personagem existente
			const character = await this.userCharactersRepository.get(data.userCharacterId)
			if (!character) {
				throw new AppError('Personagem não encontrado', 404)
			}

			// verificação se o personagem vinculado pertence ao jogador
			if (character.userId !== data.userId) {
				throw new AppError('Personagem não pertence ao usuário', 403)
			}

			// verificação se o sistema de jogo do personagem é compatível com o da mesa
			if (character.gameSystem !== mesa.gameSystem) {
				throw new AppError('O sistema de jogo do personagem não é compatível com o da mesa', 400)
			}

			// verificação se o personagem já está vinculado a outra mesa
			const jaVinculado = await this.playersRepository.getByUserCharacterId(data.userCharacterId)
			if (jaVinculado) {
				throw new AppError('Este personagem já está vinculado a outra mesa', 409)
			}
		}

		// verificação se o jogador já está na mesa
		const alreadyInMesa = await this.playersRepository.getByUserAndMesa(data.userId, data.mesaId)
		if (alreadyInMesa) {
			throw new AppError('Usuário já está nesta mesa', 409)
		}

		// checagem de lotação e criação em transação (com lock na mesa) para evitar race condition
		const created = await this.playersRepository.createWithCapacityCheck(data, mesa.maxPlayers)

		return created
	}
}
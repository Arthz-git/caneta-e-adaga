import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IUserCharactersRepository } from '../../userCharacters/repositories/IUserCharactersRepository'
import type { IUsersRepository } from '../../users/repositories/IUsersRepository'
import type { IMesaPlayersRepository } from '../repositories/IMesaPlayersRepository'
import type { CreateMesaPlayerDTO } from '../schemas/createMesaPlayer.schema'

export class CreateMesaPlayerService {
	constructor(
		private mesaPlayersRepository: IMesaPlayersRepository,
		private usersRepository: IUsersRepository,
		private mesasRepository: IMesasRepository,
		private userCharactersRepository: IUserCharactersRepository
	) { }

	async execute(data: CreateMesaPlayerDTO, userId: number) {
		// Verificação de usuário existente
		const userExists = await this.usersRepository.get(data.userId)
		if (!userExists) {
			throw new AppError('Usuário não encontrado', 404)
		}

		// verificação de mesa existente
		const mesaExists = await this.mesasRepository.get(data.mesaId)
		if (!mesaExists) {
			throw new AppError('Mesa não encontrada', 404)
		}

		// verificação se o dono da mesa é quem está adicionando o jogador
		if (mesaExists.createdBy !== userId) {
			throw new AppError('Você não tem permissão para adicionar jogadores nessa mesa', 403)
		}

		if (data.userCharacterId) {
			// verificação de personagem existente
			const charExists = await this.userCharactersRepository.get(data.userCharacterId)
			if (!charExists) {
				throw new AppError('Personagem não encontrado', 404)
			}

			// verificação se o personagem vinculado pertence ao jogador
			if (charExists.userId !== data.userId) {
				throw new AppError('Personagem não pertence ao usuário', 403)
			}
		}

		// verificação se o jogador já está na mesa
		const alreadyInMesa = await this.mesaPlayersRepository.getByUserAndMesa(data.userId, data.mesaId)
		if (alreadyInMesa) {
			throw new AppError('Usuário já está nesta mesa', 409)
		}

		const created = await this.mesaPlayersRepository.create(data)

		return created
	}
}
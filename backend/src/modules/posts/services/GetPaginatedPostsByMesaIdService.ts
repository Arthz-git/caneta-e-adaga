import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IPlayersRepository } from '../../players/repositories/IPlayersRepository'
import type { IPostsRepository } from '../repositories/IPostsRepository'
import type { GetPaginatedPostsByMesaIdDTO } from '../schemas/getPaginatedPostsByMesaId.schema'

export class GetPaginatedPostsByMesaIdService {
	constructor(
		private postsRepository: IPostsRepository,
		private mesasRepository: IMesasRepository,
		private playersRepository: IPlayersRepository
	) { }

	async execute({ mesaId, page, limit }: GetPaginatedPostsByMesaIdDTO, userId: number) {
		const mesa = await this.mesasRepository.get(mesaId)
		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		// verifica se o usuário que está fazendo a requisição pertence à mesa
		const player = await this.playersRepository.getByUserAndMesa(userId, mesaId)
		if (!player) {
			throw new AppError('Você não tem permissão para acessar este recurso', 403)
		}

		const { data, total } = await this.postsRepository.getPaginatedByMesaId(mesaId, { page, limit }, { playerId: player.id, isMaster: player.role === 'MASTER' })

		return {
			data,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		}
	}
}

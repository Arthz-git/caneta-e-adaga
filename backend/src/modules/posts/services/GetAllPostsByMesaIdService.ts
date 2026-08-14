import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IPlayersRepository } from '../../players/repositories/IPlayersRepository'
import type { IPostsRepository } from '../repositories/IPostsRepository'
import type { GetAllPostsByMesaIdDTO } from '../schemas/getAllPostsByMesaId.schema'

export class GetAllPostsByMesaIdService {
	constructor(
		private postsRepository: IPostsRepository,
		private mesasRepository: IMesasRepository,
		private playersRepository: IPlayersRepository
	) { }

	async execute(data: GetAllPostsByMesaIdDTO, userId: number) {
		const mesa = await this.mesasRepository.get(data.mesaId)
		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		// verifica se o usuário que está fazendo a requisição pertence à mesa
		const player = await this.playersRepository.getByUserAndMesa(userId, data.mesaId)
		if (!player) {
			throw new AppError('Você não tem permissão para acessar este recurso', 403)
		}

		return this.postsRepository.getAllByMesaId(data.mesaId)
	}
}

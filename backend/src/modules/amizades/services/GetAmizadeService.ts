import { AppError } from '../../../shared/errors/AppError'
import type { IAmizadesRepository } from '../repositories/IAmizadesRepository'
import type { GetAmizadeDTO } from '../schemas/getAmizade.schema'

export class GetAmizadeService {
	constructor(private amizadesRepository: IAmizadesRepository) { }

	async execute(data: GetAmizadeDTO, userId: number) {
		const amizade = await this.amizadesRepository.get(data.id)

		if (!amizade) {
			throw new AppError('Amizade não encontrada', 404)
		}

		if (amizade.userA.id !== userId && amizade.userB.id !== userId) {
			throw new AppError('Você não tem permissão para visualizar esse recurso', 403)
		}

		return amizade
	}
}

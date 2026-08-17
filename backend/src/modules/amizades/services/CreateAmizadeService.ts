import { AppError } from '../../../shared/errors/AppError'
import type { IAmizadesRepository } from '../repositories/IAmizadesRepository'
import type { CreateAmizadeDTO } from '../schemas/createAmizade.schema'

export class CreateAmizadeService {
	constructor(private amizadesRepository: IAmizadesRepository) { }

	async execute(data: CreateAmizadeDTO) {
		if (data.amigoId === data.userId) {
			throw new AppError('Não é possível criar uma amizade consigo mesmo', 400)
		}

		const amizadeExistente = await this.amizadesRepository.findByUsers(data.userId, data.amigoId)

		if (amizadeExistente) {
			throw new AppError('Vocês já são amigos', 400)
		}

		return this.amizadesRepository.create(data.userId, data.amigoId)
	}
}

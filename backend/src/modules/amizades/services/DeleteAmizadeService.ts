import { AppError } from '../../../shared/errors/AppError'
import type { IAmizadesRepository } from '../repositories/IAmizadesRepository'
import type { DeleteAmizadeDTO } from '../schemas/deleteAmizade.schema'

export class DeleteAmizadeService {
	constructor(private amizadesRepository: IAmizadesRepository) { }

	async execute(data: DeleteAmizadeDTO, userId: number) {
		const amizade = await this.amizadesRepository.get(data.id)

		if (!amizade) {
			throw new AppError('Amizade não encontrada', 404)
		}

		if (amizade.userA.id !== userId && amizade.userB.id !== userId) {
			throw new AppError('Você não tem permissão para visualizar esse recurso', 403)
		}

		await this.amizadesRepository.delete(data.id)
	}
}

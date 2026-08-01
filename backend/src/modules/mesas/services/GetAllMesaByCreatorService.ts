import { TransformMesa } from '../../../shared/composables/transformMesa'
import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import type { GetAllMesaByCreatorDTO } from '../schemas/getAllMesaByCreator.schema'

export class GetAllMesaByCreatorService {
	constructor(private mesasRepository: IMesasRepository) { }

	async execute(data: GetAllMesaByCreatorDTO, userId: number) {
		if (data.createdBy !== userId) {
			throw new AppError('Você não tem permissão para visualizar as mesas deste usuário', 403)
		}

		const mesas = await this.mesasRepository.getAllByCreator(data.createdBy)

		return TransformMesa(mesas)
	}
}
import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import type { DeleteMesaDTO } from '../schemas/deleteMesa.schema'

export class DeleteMesaService {
	constructor(private mesasRepository: IMesasRepository) { }

	async execute(data: DeleteMesaDTO, userId: number) {
		const mesa = await this.mesasRepository.get(data.id)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		if (mesa.createdBy !== userId) {
			throw new AppError('Você não tem permissão para excluir esta mesa', 403)
		}

		await this.mesasRepository.delete(data.id)
	}
}

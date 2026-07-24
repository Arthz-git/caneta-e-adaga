import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import type { UpdateMesaDTO } from '../schemas/updateMesa.schema'

export class UpdateMesaService {
	constructor(private mesasRepository: IMesasRepository) { }

	async execute(data: UpdateMesaDTO, userId: number) {
		const mesa = await this.mesasRepository.get(data.id)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		if (mesa.createdBy !== userId) {
			throw new AppError('Você não tem permissão para atualizar esta mesa', 403)
		}

		return await this.mesasRepository.update(data)
	}
}

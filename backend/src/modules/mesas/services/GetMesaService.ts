import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import { GetMesaDTO } from '../schemas/getMesa.schema'

export class GetMesaService {
	constructor(private mesasRepository: IMesasRepository) { }

	async execute(data: GetMesaDTO) {
		const mesa = await this.mesasRepository.get(data.id)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		return mesa
	}
}

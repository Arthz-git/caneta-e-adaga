import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../repositories/IMesasRepository'

export class GetAllMesaService {
	constructor(private mesasRepository: IMesasRepository) { }

	async execute() {
		const mesas = await this.mesasRepository.getAll()

		if (mesas.length === 0) {
			return new AppError('Nenhuma mesa encontrada', 404)
		}

		return mesas
	}
}
import type { IMesasRepository } from '../repositories/IMesasRepository'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'

export class CreateMesaService {
	constructor(private mesaRepository: IMesasRepository) { }

	async execute(data: CreateMesaDTO) {
		return await this.mesaRepository.create(data)
	}
}
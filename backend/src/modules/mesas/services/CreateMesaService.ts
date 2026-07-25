import { IMesaPlayersRepository } from '../../mesaPlayers/repositories/IMesaPlayersRepository'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'

export class CreateMesaService {
	constructor(
		private mesasRepository: IMesasRepository,
		private mesaPlayersRepository: IMesaPlayersRepository
	) { }

	async execute(data: CreateMesaDTO) {
		const created = await this.mesasRepository.create(data)

		await this.mesaPlayersRepository.create({
			userId: data.createdBy,
			mesaId: created.id,
			role: 'MASTER',
			userCharacterId: null
		})

		return created
	}
}
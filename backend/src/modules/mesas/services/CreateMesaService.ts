import { IPlayersRepository } from '../../players/repositories/IPlayersRepository'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'

export class CreateMesaService {
	constructor(
		private mesasRepository: IMesasRepository,
		private playersRepository: IPlayersRepository
	) { }

	async execute(data: CreateMesaDTO) {
		const created = await this.mesasRepository.create(data)

		await this.playersRepository.create({
			userId: data.createdBy,
			mesaId: created.id,
			role: 'MASTER',
			userCharacterId: null
		})

		return created
	}
}
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

		const countOccupiedSlots = mesa.players.filter(player => player.role !== 'SPECTATOR').length
		if (data.maxPlayers < countOccupiedSlots) {
			throw new AppError('O número máximo de jogadores não pode ser menor que o número de jogadores já na mesa', 400)
		}

		const hasSpectators = mesa.players.some(player => player.role === 'SPECTATOR')
		if (!data.allowSpectators && hasSpectators) {
			throw new AppError('Não é possível desativar espectadores enquanto houver espectadores na mesa', 400)
		}

		return await this.mesasRepository.update(data)
	}
}

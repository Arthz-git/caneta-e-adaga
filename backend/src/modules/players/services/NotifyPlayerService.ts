import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { INotificacoesRepository } from '../../notificacoes/repositories/INotificacoesRepository'
import type { IPlayersRepository } from '../repositories/IPlayersRepository'
import type { NotifyPlayerDTO } from '../schemas/notifyPlayer.schema'

export class NotifyPlayerService {
	constructor(
		private playersRepository: IPlayersRepository,
		private mesasRepository: IMesasRepository,
		private notificacoesRepository: INotificacoesRepository
	) { }

	async execute(data: NotifyPlayerDTO, userId: number) {
		const player = await this.playersRepository.get(data.id)

		if (!player) {
			throw new AppError('Registro não encontrado', 404)
		}

		const mesa = await this.mesasRepository.get(player.mesaId)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		if (mesa.createdBy !== userId) {
			throw new AppError('Você não tem permissão para notificar jogadores dessa mesa', 403)
		}

		if (player.userId === userId) {
			throw new AppError('Você não pode notificar a si mesmo', 400)
		}

		await this.notificacoesRepository.create({
			destinoId: player.userId,
			remetenteId: userId,
			tipo: 'LEMBRETE_JOGADA',
			message: `A mesa "${mesa.title}" está aguardando sua jogada!`,
			mesaId: mesa.id
		})
	}
}

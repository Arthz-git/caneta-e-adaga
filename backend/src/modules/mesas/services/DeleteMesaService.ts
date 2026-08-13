import { AppError } from '../../../shared/errors/AppError'
import type { INotificacoesRepository } from '../../notificacoes/repositories/INotificacoesRepository'
import type { IPlayersRepository } from '../../players/repositories/IPlayersRepository'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import type { DeleteMesaDTO } from '../schemas/deleteMesa.schema'

export class DeleteMesaService {
	constructor(
		private mesasRepository: IMesasRepository,
		private playersRepository: IPlayersRepository,
		private notificacoesRepository: INotificacoesRepository
	) { }

	async execute(data: DeleteMesaDTO, userId: number) {
		const mesa = await this.mesasRepository.get(data.id)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		if (mesa.createdBy !== userId) {
			throw new AppError('Você não tem permissão para excluir esta mesa', 403)
		}

		const players = await this.playersRepository.getPlayersByMesaId(mesa.id)

		await this.mesasRepository.delete(data.id)

		const recipients = players.filter(player => player.userId !== userId)
		await Promise.all(recipients.map(recipient => this.notificacoesRepository.create({
			destinoId: recipient.userId,
			remetenteId: userId,
			tipo: 'MESA_EXCLUIDA',
			message: `A mesa "${mesa.title}" foi excluída`
		})))
	}
}

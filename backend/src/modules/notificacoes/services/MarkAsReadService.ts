import { AppError } from '../../../shared/errors/AppError'
import type { INotificacoesRepository } from '../repositories/INotificacoesRepository'
import type { NotificacaoIdDTO } from '../schemas/notificacaoId.schema'

export class MarkAsReadService {
	constructor(private notificacoesRepository: INotificacoesRepository) { }

	async execute(data: NotificacaoIdDTO, userId: number) {
		const notificacao = await this.notificacoesRepository.get(data.id)

		if (!notificacao) {
			throw new AppError('Notificação não encontrada', 404)
		}

		if (notificacao.destino.id !== userId) {
			throw new AppError('Você não tem permissão para acessar esta notificação', 403)
		}

		return await this.notificacoesRepository.markAsRead(data.id)
	}
}

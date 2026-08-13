import { AppError } from '../../../shared/errors/AppError'
import type { INotificacoesRepository } from '../repositories/INotificacoesRepository'
import type { NotificacaoIdDTO } from '../schemas/notificacaoId.schema'

export class DeleteNotificacaoService {
	constructor(private notificacoesRepository: INotificacoesRepository) { }

	async execute(data: NotificacaoIdDTO, userId: number) {
		const notificacao = await this.notificacoesRepository.get(data.id)

		if (!notificacao) {
			throw new AppError('Notificação não encontrada', 404)
		}

		if (notificacao.destino.id !== userId) {
			throw new AppError('Você não tem permissão para excluir esta notificação', 403)
		}

		await this.notificacoesRepository.delete(data.id)
	}
}

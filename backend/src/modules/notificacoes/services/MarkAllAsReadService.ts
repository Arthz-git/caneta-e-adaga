import type { INotificacoesRepository } from '../repositories/INotificacoesRepository'

export class MarkAllAsReadService {
	constructor(private notificacoesRepository: INotificacoesRepository) { }

	async execute(destinoId: number) {
		await this.notificacoesRepository.markAllAsRead(destinoId)
	}
}

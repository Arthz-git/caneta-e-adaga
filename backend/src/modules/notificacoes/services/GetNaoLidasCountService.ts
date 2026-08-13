import type { INotificacoesRepository } from '../repositories/INotificacoesRepository'

export class GetNaoLidasCountService {
	constructor(private notificacoesRepository: INotificacoesRepository) { }

	async execute(destinoId: number) {
		const count = await this.notificacoesRepository.countNaoLidas(destinoId)

		return { count }
	}
}

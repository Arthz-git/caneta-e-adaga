import type { INotificacoesRepository } from '../repositories/INotificacoesRepository'
import type { CreateNotificacaoDTO } from '../schemas/createNotificacao.schema'

export class CreateNotificacaoService {
	constructor(private notificacoesRepository: INotificacoesRepository) { }

	async execute(data: CreateNotificacaoDTO) {
		return await this.notificacoesRepository.create(data)
	}
}

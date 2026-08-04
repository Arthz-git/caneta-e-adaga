import { AppError } from '../../../shared/errors/AppError'
import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { CreateSolicitacaoDTO } from '../schemas/createSolicitacao.schema'

export class CreateSolicitacaoService {
	constructor(private solicitacoesRepository: ISolicitacoesRepository) { }

	async execute(data: CreateSolicitacaoDTO) {
		if (data.destinoId === data.solicitanteId) {
			throw new AppError('Não é possível criar uma solicitação para si mesmo', 400)
		}

		return await this.solicitacoesRepository.create(data)
	}
}

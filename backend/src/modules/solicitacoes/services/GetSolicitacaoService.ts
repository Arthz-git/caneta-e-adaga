import { AppError } from '../../../shared/errors/AppError'
import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { GetSolicitacaoDTO } from '../schemas/getSolicitacao.schema'

export class GetSolicitacaoService {
	constructor(private solicitacoesRepository: ISolicitacoesRepository) { }

	async execute(data: GetSolicitacaoDTO, userId: number) {
		const solicitacao = await this.solicitacoesRepository.get(data.id)

		if (!solicitacao) {
			throw new AppError('Solicitação não encontrada', 404)
		}

		if (solicitacao.solicitante.id !== userId && solicitacao.destino.id !== userId) {
			throw new AppError('Você não tem permissão para visualizar esta solicitação', 403)
		}

		return solicitacao
	}
}

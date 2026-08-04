import { AppError } from '../../../shared/errors/AppError'
import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { CancelarSolicitacaoDTO } from '../schemas/cancelarSolicitacao.schema'

export class CancelarSolicitacaoService {
	constructor(private solicitacoesRepository: ISolicitacoesRepository) { }

	async execute(data: CancelarSolicitacaoDTO, userId: number) {
		const solicitacao = await this.solicitacoesRepository.get(data.id)

		if (!solicitacao) {
			throw new AppError('Solicitação não encontrada', 404)
		}

		if (solicitacao.solicitante.id !== userId) {
			throw new AppError('Você não tem permissão para cancelar esta solicitação', 403)
		}

		if (solicitacao.status !== 'PENDENTE') {
			throw new AppError('Esta solicitação já foi respondida ou cancelada', 400)
		}

		return await this.solicitacoesRepository.updateStatus(data.id, 'CANCELADA')
	}
}

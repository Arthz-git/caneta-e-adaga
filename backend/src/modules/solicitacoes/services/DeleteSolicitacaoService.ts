import { AppError } from '../../../shared/errors/AppError'
import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { DeleteSolicitacaoDTO } from '../schemas/deleteSolicitacao.schema'

export class DeleteSolicitacaoService {
	constructor(private solicitacoesRepository: ISolicitacoesRepository) { }

	async execute(data: DeleteSolicitacaoDTO, userId: number) {
		const solicitacao = await this.solicitacoesRepository.get(data.id)

		if (!solicitacao) {
			throw new AppError('Solicitação não encontrada', 404)
		}

		if (solicitacao.solicitante.id !== userId && solicitacao.destino.id !== userId) {
			throw new AppError('Você não tem permissão para excluir esta solicitação', 403)
		}

		if (solicitacao.status === 'PENDENTE') {
			throw new AppError('Não é possível excluir uma solicitação pendente', 400)
		}

		await this.solicitacoesRepository.delete(data.id)
	}
}

import { AppError } from '../../../shared/errors/AppError'
import type { INotificacoesRepository } from '../../notificacoes/repositories/INotificacoesRepository'
import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { ResponderSolicitacaoDTO } from '../schemas/responderSolicitacao.schema'

export class ResponderSolicitacaoService {
	constructor(
		private solicitacoesRepository: ISolicitacoesRepository,
		private notificacoesRepository: INotificacoesRepository
	) { }

	async execute(data: ResponderSolicitacaoDTO, userId: number) {
		const solicitacao = await this.solicitacoesRepository.get(data.id)

		if (!solicitacao) {
			throw new AppError('Solicitação não encontrada', 404)
		}

		if (solicitacao.destino.id !== userId) {
			throw new AppError('Você não tem permissão para responder esta solicitação', 403)
		}

		if (solicitacao.status !== 'PENDENTE') {
			throw new AppError('Esta solicitação já foi respondida ou cancelada', 400)
		}

		const atualizada = await this.solicitacoesRepository.updateStatus(data.id, data.status)

		await this.notificacoesRepository.create({
			destinoId: solicitacao.solicitante.id,
			remetenteId: userId,
			tipo: data.status === 'ACEITA' ? 'SOLICITACAO_ACEITA' : 'SOLICITACAO_RECUSADA',
			message: data.status === 'ACEITA' ? 'Sua solicitação foi aceita' : 'Sua solicitação foi recusada',
			solicitacaoId: solicitacao.id,
			mesaId: solicitacao.mesa?.id
		})

		return atualizada
	}
}

import { AppError } from '../../../shared/errors/AppError'
import type { IAmizadesRepository } from '../../amizades/repositories/IAmizadesRepository'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { INotificacoesRepository } from '../../notificacoes/repositories/INotificacoesRepository'
import type { IPlayersRepository } from '../../players/repositories/IPlayersRepository'
import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { ResponderSolicitacaoDTO } from '../schemas/responderSolicitacao.schema'

export class ResponderSolicitacaoService {
	constructor(
		private solicitacoesRepository: ISolicitacoesRepository,
		private notificacoesRepository: INotificacoesRepository,
		private amizadesRepository: IAmizadesRepository,
		private playersRepository: IPlayersRepository,
		private mesasRepository: IMesasRepository
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

		if (data.status === 'ACEITA' && solicitacao.motivo === 'PEDIDO_AMIZADE') {
			const amizadeExistente = await this.amizadesRepository.findByUsers(solicitacao.solicitante.id, solicitacao.destino.id)

			if (!amizadeExistente) {
				await this.amizadesRepository.create(solicitacao.solicitante.id, solicitacao.destino.id)
			}
		}

		if (data.status === 'ACEITA' && solicitacao.motivo === 'CONVITE_MESA' && solicitacao.mesa) {
			const jaEstaNaMesa = await this.playersRepository.getByUserAndMesa(solicitacao.destino.id, solicitacao.mesa.id)

			if (!jaEstaNaMesa) {
				const mesa = await this.mesasRepository.get(solicitacao.mesa.id)

				if (mesa) {
					await this.playersRepository.createWithCapacityCheck({
						userId: solicitacao.destino.id,
						mesaId: solicitacao.mesa.id,
						role: 'PLAYER',
						userCharacterId: null
					}, mesa.maxPlayers)
				}
			}
		}

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

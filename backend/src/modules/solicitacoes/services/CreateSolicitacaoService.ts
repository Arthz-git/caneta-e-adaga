import { AppError } from '../../../shared/errors/AppError'
import type { INotificacoesRepository } from '../../notificacoes/repositories/INotificacoesRepository'
import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { CreateSolicitacaoDTO } from '../schemas/createSolicitacao.schema'

const motivoMessages: Record<CreateSolicitacaoDTO['motivo'], string> = {
	PEDIDO_AMIZADE: 'Você recebeu um pedido de amizade',
	CONVITE_MESA: 'Você recebeu um convite para uma mesa',
	PEDIDO_ENTRADA_MESA_JOGADOR: 'Você recebeu um pedido de entrada como jogador',
	PEDIDO_ENTRADA_MESA_ESPECTADOR: 'Você recebeu um pedido de entrada como espectador'
}

export class CreateSolicitacaoService {
	constructor(
		private solicitacoesRepository: ISolicitacoesRepository,
		private notificacoesRepository: INotificacoesRepository
	) { }

	async execute(data: CreateSolicitacaoDTO) {
		if (data.destinoId === data.solicitanteId) {
			throw new AppError('Não é possível criar uma solicitação para si mesmo', 400)
		}

		const solicitacao = await this.solicitacoesRepository.create(data)

		await this.notificacoesRepository.create({
			destinoId: data.destinoId,
			remetenteId: data.solicitanteId,
			tipo: 'SOLICITACAO_RECEBIDA',
			message: motivoMessages[data.motivo],
			solicitacaoId: solicitacao.id,
			mesaId: data.mesaId
		})

		return solicitacao
	}
}

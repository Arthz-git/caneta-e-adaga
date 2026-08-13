import { AppError } from '../../../shared/errors/AppError'
import { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { GetMySolicitacaoByMesaIdDTO } from '../schemas/getMySolicitacaoByMesaId.schema'

export class GetMySolicitacaoByMesaIdService {
	constructor(
		private solicitacoesRepository: ISolicitacoesRepository,
		private mesaRepository: IMesasRepository
	) { }

	async execute({ mesaId }: GetMySolicitacaoByMesaIdDTO, userId: number) {
		const mesa = await this.mesaRepository.get(mesaId)

		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		const solicitacoes = await this.solicitacoesRepository.getMySolicitacaoByMesaId(userId, mesaId)

		return solicitacoes
	}
}

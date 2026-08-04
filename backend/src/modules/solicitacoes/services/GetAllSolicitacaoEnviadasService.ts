import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { GetAllSolicitacaoPaginatedDTO } from '../schemas/getAllSolicitacaoPaginated.schema'

export class GetAllSolicitacaoEnviadasService {
	constructor(private solicitacoesRepository: ISolicitacoesRepository) { }

	async execute({ page, limit, status, motivo }: GetAllSolicitacaoPaginatedDTO, solicitanteId: number) {
		const { data, total } = await this.solicitacoesRepository.getAllEnviadasPaginated(solicitanteId, { page, limit, status, motivo })

		return {
			data,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		}
	}
}

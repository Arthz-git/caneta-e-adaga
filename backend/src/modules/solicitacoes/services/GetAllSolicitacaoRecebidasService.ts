import type { ISolicitacoesRepository } from '../repositories/ISolicitacoesRepository'
import type { GetAllSolicitacaoPaginatedDTO } from '../schemas/getAllSolicitacaoPaginated.schema'

export class GetAllSolicitacaoRecebidasService {
	constructor(private solicitacoesRepository: ISolicitacoesRepository) { }

	async execute({ page, limit, status, motivo }: GetAllSolicitacaoPaginatedDTO, destinoId: number) {
		const { data, total } = await this.solicitacoesRepository.getAllRecebidasPaginated(destinoId, { page, limit, status, motivo })

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

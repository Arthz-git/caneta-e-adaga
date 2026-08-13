import type { INotificacoesRepository } from '../repositories/INotificacoesRepository'
import type { GetAllNotificacaoPaginatedDTO } from '../schemas/getAllNotificacaoPaginated.schema'

export class GetAllNotificacaoService {
	constructor(private notificacoesRepository: INotificacoesRepository) { }

	async execute({ page, limit, apenasNaoLidas }: GetAllNotificacaoPaginatedDTO, destinoId: number) {
		const { data, total } = await this.notificacoesRepository.getAllByDestinoPaginated(destinoId, { page, limit, apenasNaoLidas })

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

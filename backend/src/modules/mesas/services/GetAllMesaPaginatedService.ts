import { TransformMesa } from '../../../shared/composables/transformMesa'
import type { IMesasRepository } from '../repositories/IMesasRepository'
import type { GetAllMesaPaginatedDTO } from '../schemas/getAllMesaPaginated.schema'

export class GetAllMesaPaginatedService {
	constructor(private mesasRepository: IMesasRepository) { }

	async execute({ page, limit, search }: GetAllMesaPaginatedDTO) {
		const { data, total } = await this.mesasRepository.getAllPaginated({ page, limit, search })

		return {
			data: TransformMesa(data),
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		}
	}
}

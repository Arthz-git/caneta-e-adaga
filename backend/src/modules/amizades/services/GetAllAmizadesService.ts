import type { IAmizadesRepository } from '../repositories/IAmizadesRepository'
import type { GetAllAmizadesPaginatedDTO } from '../schemas/getAllAmizadesPaginated.schema'

export class GetAllAmizadesService {
	constructor(private amizadesRepository: IAmizadesRepository) { }

	async execute({ page, limit }: GetAllAmizadesPaginatedDTO, userId: number) {
		const { data, total } = await this.amizadesRepository.getAllPaginated(userId, { page, limit })

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

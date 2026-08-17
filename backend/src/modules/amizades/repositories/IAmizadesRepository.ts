import type { AmizadeModel } from '../../../generated/prisma/models'
import type { AmizadeResponseRepository } from '../schemas/amizadeResponse.schema'

export interface GetAllPaginatedParams {
	page: number
	limit: number
}

export interface GetAllPaginatedResult {
	data: AmizadeResponseRepository[]
	total: number
}

export interface IAmizadesRepository {
	create(userAId: number, userBId: number): Promise<AmizadeModel>
	get(id: number): Promise<AmizadeResponseRepository | null>
	findByUsers(userAId: number, userBId: number): Promise<AmizadeResponseRepository | null>
	delete(id: number): Promise<void>
	getAllPaginated(userId: number, params: GetAllPaginatedParams): Promise<GetAllPaginatedResult>
}

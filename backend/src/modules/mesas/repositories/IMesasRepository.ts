import type { MesaModel } from '../../../generated/prisma/models'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'
import type { UpdateMesaDTO } from '../schemas/updateMesa.schema'
import type { MesaResponseRepository } from '../schemas/mesaResponse.schema'

export interface GetAllPaginatedParams {
	page: number
	limit: number
	search?: string
}

export interface GetAllPaginatedResult {
	data: MesaResponseRepository[]
	total: number
}

export interface IMesasRepository {
	create(data: CreateMesaDTO): Promise<MesaModel>
	update(data: UpdateMesaDTO): Promise<MesaModel>
	delete(id: number): Promise<void>
	get(id: number): Promise<MesaResponseRepository | null>
	getAllByCreator(userId: number): Promise<MesaResponseRepository[]>
	getAll(): Promise<MesaResponseRepository[]>
	getAllPaginated(params: GetAllPaginatedParams): Promise<GetAllPaginatedResult>
}

import type { MesaModel } from '../../../generated/prisma/models'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'
import type { UpdateMesaDTO } from '../schemas/updateMesa.schema'
import type { MesaResponseDTO } from '../schemas/mesaResponse.schema'

export interface GetAllPaginatedParams {
	page: number
	limit: number
	search?: string
}

export interface GetAllPaginatedResult {
	data: MesaResponseDTO[]
	total: number
}

export interface IMesasRepository {
	create(data: CreateMesaDTO): Promise<MesaModel>
	update(data: UpdateMesaDTO): Promise<MesaModel>
	delete(id: number): Promise<void>
	get(id: number): Promise<MesaResponseDTO | null>
	getAllByCreator(userId: number): Promise<MesaResponseDTO[]>
	getAll(): Promise<MesaResponseDTO[]>
	getAllPaginated(params: GetAllPaginatedParams): Promise<GetAllPaginatedResult>
}

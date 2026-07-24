import type { MesaModel } from '../../../generated/prisma/models'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'
import type { UpdateMesaDTO } from '../schemas/updateMesa.schema'

export interface IMesasRepository {
	create(data: CreateMesaDTO): Promise<MesaModel>
	update(data: UpdateMesaDTO): Promise<MesaModel>
	delete(id: number): Promise<void>
	get(id: number): Promise<MesaModel | null>
	getAllByCreator(userId: number): Promise<MesaModel[]>
}

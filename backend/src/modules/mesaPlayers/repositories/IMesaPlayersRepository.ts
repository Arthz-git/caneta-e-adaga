import type { MesaPlayersModel } from '../../../generated/prisma/models'
import type { CreateMesaPlayerDTO } from '../schemas/createMesaPlayer.schema'
import type { UpdateCharacterMesaPlayerDTO } from '../schemas/updateCharacterMesaPlayer.schema'
import type { UpdateRoleMesaPlayerDTO } from '../schemas/updateRoleMesaPlayer.schema'

export interface IMesaPlayersRepository {
	create(data: CreateMesaPlayerDTO): Promise<MesaPlayersModel>
	delete(id: number): Promise<void>
	get(id: number): Promise<MesaPlayersModel | null>
	getByUserAndMesa(userId: number, mesaId: number): Promise<MesaPlayersModel | null>
	updateRole(data: UpdateRoleMesaPlayerDTO): Promise<MesaPlayersModel>
	updateCharacter(data: UpdateCharacterMesaPlayerDTO): Promise<MesaPlayersModel>
}

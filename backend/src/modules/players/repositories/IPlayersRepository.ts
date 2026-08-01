import type { PlayersModel } from '../../../generated/prisma/models'
import type { CreatePlayerDTO } from '../schemas/createPlayer.schema'
import type { UpdateCharacterPlayerDTO } from '../schemas/updateCharacterPlayer.schema'
import { UpdateFavoritePlayerDTO } from '../schemas/updateFavoritePlayer.schema'
import type { UpdateRolePlayerDTO } from '../schemas/updateRolePlayer.schema'

export interface IPlayersRepository {
	create(data: CreatePlayerDTO): Promise<PlayersModel>
	createWithCapacityCheck(data: CreatePlayerDTO, maxPlayers: number): Promise<PlayersModel>
	delete(id: number): Promise<void>
	get(id: number): Promise<PlayersModel | null>
	getByUserAndMesa(userId: number, mesaId: number): Promise<PlayersModel | null>
	updateRole(data: UpdateRolePlayerDTO): Promise<PlayersModel>
	updateRoleWithMasterCheck(data: UpdateRolePlayerDTO, mesaId: number): Promise<PlayersModel>
	updateCharacter(data: UpdateCharacterPlayerDTO): Promise<PlayersModel>
	getPlayersByMesaId(mesaId: number): Promise<PlayersModel[]>
	updateFavorite(data: UpdateFavoritePlayerDTO): Promise<PlayersModel>
}

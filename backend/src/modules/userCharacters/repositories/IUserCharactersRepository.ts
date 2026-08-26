import type { UserCharacterModel, UserCharacterSheetHistoryModel } from '../../../generated/prisma/models'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import type { UpdateUserCharacterDTO } from '../schemas/updateUserCharacter.schema'

export type UserCharacterWithLink = UserCharacterModel & { linkedMesaId: number | null, linkedMesaTitle: string | null }

export type CreateSheetHistoryDTO = {
	userCharacterId: number
	changedById: number
	previousSheet: unknown
	newSheet: unknown
}

export interface IUserCharactersRepository {
	create(data: CreateUserCharacterDTO): Promise<UserCharacterModel>
	update(data: UpdateUserCharacterDTO): Promise<UserCharacterModel>
	delete(id: number): Promise<void>
	get(id: number): Promise<UserCharacterModel | null>
	getAllByUserId(userId: number): Promise<UserCharacterWithLink[]>
	addSheetHistory(data: CreateSheetHistoryDTO): Promise<void>
	getSheetHistory(userCharacterId: number): Promise<UserCharacterSheetHistoryModel[]>
}

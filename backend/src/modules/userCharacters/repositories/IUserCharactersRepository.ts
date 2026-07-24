import type { UserCharacterModel } from '../../../generated/prisma/models'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import type { UpdateUserCharacterDTO } from '../schemas/updateUserCharacter.schema'

export interface IUserCharactersRepository {
	create(data: CreateUserCharacterDTO): Promise<UserCharacterModel>
	update(data: UpdateUserCharacterDTO): Promise<UserCharacterModel>
	delete(id: number): Promise<void>
	get(id: number): Promise<UserCharacterModel | null>
	getAllByUserId(userId: number): Promise<UserCharacterModel[]>
}

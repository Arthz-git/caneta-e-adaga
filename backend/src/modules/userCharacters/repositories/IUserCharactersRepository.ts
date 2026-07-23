import type { UserCharacterModel } from '../../../generated/prisma/models'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import type { UpdateUserCharacterDTO } from '../schemas/updateUserCharacter.schema'

export interface IUserCharactersRepository {
	create(data: CreateUserCharacterDTO): Promise<UserCharacterModel>
	update(data: UpdateUserCharacterDTO): Promise<UserCharacterModel>
	delete(id: number): Promise<void>
	find(id: number): Promise<UserCharacterModel | null>
	findAllByUserId(userId: number): Promise<UserCharacterModel[] | null>
}

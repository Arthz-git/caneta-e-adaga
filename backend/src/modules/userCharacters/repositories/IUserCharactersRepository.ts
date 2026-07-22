import type { UserCharacterModel } from '../../../generated/prisma/models'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'

export interface IUserCharactersRepository {
	create(data: CreateUserCharacterDTO): Promise<UserCharacterModel>
}

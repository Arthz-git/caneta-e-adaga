import type { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'

export class CreateUserCharacterService {
	constructor(private userCharactersRepository: IUserCharactersRepository) { }

	async execute(data: CreateUserCharacterDTO) {
		const userCharacter = await this.userCharactersRepository.create(data)

		return userCharacter
	}
}
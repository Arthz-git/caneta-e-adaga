import { AppError } from '../../../shared/errors/AppError'
import type { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import type { FindUserCharacterDTO } from '../schemas/findUserCharacter.schema'

export class FindUserCharacterService {
	constructor(private userCharactersRepository: IUserCharactersRepository) { }

	async execute(data: FindUserCharacterDTO) {
		const userCharacter = await this.userCharactersRepository.find(data.id)

		if (!userCharacter) {
			throw new AppError('Personagem não encontrado', 404)
		}

		return userCharacter
	}
}
import { AppError } from '../../../shared/errors/AppError'
import type { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import type { GetUserCharacterDTO } from '../schemas/getUserCharacter.schema'

export class GetUserCharacterService {
	constructor(private userCharactersRepository: IUserCharactersRepository) { }

	async execute(data: GetUserCharacterDTO) {
		const userCharacter = await this.userCharactersRepository.get(data.id)

		if (!userCharacter) {
			throw new AppError('Personagem não encontrado', 404)
		}

		return userCharacter
	}
}
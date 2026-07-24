import { AppError } from '../../../shared/errors/AppError'
import type { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import type { UpdateUserCharacterDTO } from '../schemas/updateUserCharacter.schema'

export class UpdateUserCharacterService {
	constructor(private userCharactersRepository: IUserCharactersRepository) { }

	async execute(data: UpdateUserCharacterDTO, userId: number) {
		const userCharacter = await this.userCharactersRepository.get(data.id)

		if (!userCharacter) {
			throw new AppError('Personagem não encontrado', 404)
		}

		if (userCharacter.userId !== userId) {
			throw new AppError('Você não tem permissão para atualizar este personagem', 403)
		}

		await this.userCharactersRepository.update(data)
	}
}

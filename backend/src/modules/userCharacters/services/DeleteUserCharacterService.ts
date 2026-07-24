import { AppError } from '../../../shared/errors/AppError'
import type { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import type { DeleteUserCharacterDTO } from '../schemas/deleteUserCharacter.schema'

export class DeleteUserCharacterService {
	constructor(private userCharactersRepository: IUserCharactersRepository) { }

	async execute(data: DeleteUserCharacterDTO, userId: number) {
		const userCharacter = await this.userCharactersRepository.get(data.id)

		if (!userCharacter) {
			throw new AppError('Personagem não encontrado', 404)
		}

		if (userCharacter.userId !== userId) {
			throw new AppError('Você não tem permissão para excluir este personagem', 403)
		}

		await this.userCharactersRepository.delete(data.id)
	}
}

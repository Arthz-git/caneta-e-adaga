import { AppError } from '../../../shared/errors/AppError'
import type { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import type { GetUserCharacterDTO } from '../schemas/getUserCharacter.schema'

export class GetUserCharacterSheetHistoryService {
	constructor(private userCharactersRepository: IUserCharactersRepository) { }

	async execute(data: GetUserCharacterDTO, userId: number) {
		const userCharacter = await this.userCharactersRepository.get(data.id)

		if (!userCharacter) {
			throw new AppError('Personagem não encontrado', 404)
		}

		if (userCharacter.userId !== userId) {
			throw new AppError('Você não tem permissão para visualizar o histórico deste personagem', 403)
		}

		return this.userCharactersRepository.getSheetHistory(userCharacter.id)
	}
}

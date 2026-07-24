import type { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import type { GetAllUserCharacterByUserIdDTO } from '../schemas/getAllUserCharacterByUserId.schema'

export class GetAllUserCharacterByUserIdService {
	constructor(private userCharactersRepository: IUserCharactersRepository) { }

	async execute(data: GetAllUserCharacterByUserIdDTO) {
		return await this.userCharactersRepository.getAllByUserId(data.userId)
	}
}
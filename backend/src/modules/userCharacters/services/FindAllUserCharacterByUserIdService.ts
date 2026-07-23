import type { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import type { FindAllUserCharacterByUserIdDTO } from '../schemas/findAllUserCharacterByUserId.schema'

export class FindAllUserCharacterByUserIdService {
	constructor(private userCharactersRepository: IUserCharactersRepository) { }

	async execute(data: FindAllUserCharacterByUserIdDTO) {
		return await this.userCharactersRepository.findAllByUserId(data.userId)
	}
}
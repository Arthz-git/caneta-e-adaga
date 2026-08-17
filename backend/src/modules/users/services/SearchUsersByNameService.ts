import type { IUsersRepository } from '../repositories/IUsersRepository'
import type { SearchUsersByNameDTO } from '../schemas/searchUsersByName.schema'

export class SearchUsersByNameService {
	constructor(private usersRepository: IUsersRepository) { }

	async execute(data: SearchUsersByNameDTO) {
		return this.usersRepository.searchByName(data.name)
	}
}

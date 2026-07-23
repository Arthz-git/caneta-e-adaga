import { AppError } from '../../../shared/errors/AppError';
import { IUsersRepository } from '../../users/repositories/IUsersRepository';
import { IUserCharactersRepository } from '../repositories/IUserCharactersRepository'
import { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema';

export class CreateUserCharacterService {
	constructor(
		private userCharactersRepository: IUserCharactersRepository,
		private usersRepository: IUsersRepository
	) { }

	async execute(data: CreateUserCharacterDTO) {
		const userExists = await this.usersRepository.findById(data.userId)

		if (!userExists) {
			throw new AppError('Usuário inválido', 400)
		}

		const userCharacter = await this.userCharactersRepository.create(data)

		return userCharacter
	}
}
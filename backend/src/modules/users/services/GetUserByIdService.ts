import { AppError } from '../../../shared/errors/AppError'
import type { IUsersRepository } from '../repositories/IUsersRepository'

export class GetUserByIdService {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(id: number) {
		const user = await this.usersRepository.get(id)

		if (!user) {
			throw new AppError('Usuário não encontrado', 404)
		}

		const { password: _password, ...userWithoutPassword } = user

		return userWithoutPassword
	}
}

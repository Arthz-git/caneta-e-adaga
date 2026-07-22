import { AppError } from '../../../shared/errors/AppError'
import type { IUsersRepository } from '../repositories/IUsersRepository'

export class FindUserByEmailService {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(email: string) {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new AppError('Usuário não encontrado', 404)
		}

		const { password: _password, ...userWithoutPassword } = user

		return userWithoutPassword
	}
}

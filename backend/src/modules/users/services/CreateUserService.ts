import { hash } from 'bcryptjs'
import { AppError } from '../../../shared/errors/AppError'
import type { IUsersRepository } from '../repositories/IUsersRepository'
import type { CreateUserDTO } from '../schemas/createUser.schema'

export class CreateUserService {
	constructor(private usersRepository: IUsersRepository) {}

	async execute({ name, email, password }: CreateUserDTO) {
		const userAlreadyExists = await this.usersRepository.findByEmail(email)

		if (userAlreadyExists) {
			throw new AppError('E-mail já está em uso', 409)
		}

		const hashedPassword = await hash(password, 8)

		const user = await this.usersRepository.create({
			name,
			email,
			password: hashedPassword
		})

		const { password: _password, ...userWithoutPassword } = user

		return userWithoutPassword
	}
}

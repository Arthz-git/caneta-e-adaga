import { sign } from 'jsonwebtoken'
import { env } from '../../../config/env'
import { AppError } from '../../../shared/errors/AppError'
import type { IUsersRepository } from '../../users/repositories/IUsersRepository'
import type { DevTokenDTO } from '../schemas/devToken.schema'

export class DevTokenService {
	constructor(private usersRepository: IUsersRepository) {}

	async execute({ email }: DevTokenDTO) {
		const user = await this.usersRepository.getByEmail(email)

		if (!user) {
			throw new AppError('Usuário não encontrado', 404)
		}

		const accessToken = sign({ email: user.email, role: user.role }, env.JWT_SECRET, {
			subject: String(user.id),
			expiresIn: env.JWT_EXPIRES_IN
		})

		return { accessToken }
	}
}

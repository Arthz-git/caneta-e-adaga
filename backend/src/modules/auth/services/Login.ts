import { randomBytes, createHash } from 'node:crypto'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { env } from '../../../config/env'
import { AppError } from '../../../shared/errors/AppError'
import type { IUsersRepository } from '../../users/repositories/IUsersRepository'
import type { IRefreshTokenRepository } from '../../refreshToken/repositories/IRefreshTokenRepository'
import type { LoginDTO } from '../schemas/login.schema'

export class LoginService {
	constructor(
		private usersRepository: IUsersRepository,
		private refreshTokenRepository: IRefreshTokenRepository
	) {}

	async execute({ email, password }: LoginDTO) {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new AppError('E-mail ou senha inválidos', 401)
		}

		const passwordMatches = await compare(password, user.password)

		if (!passwordMatches) {
			throw new AppError('E-mail ou senha inválidos', 401)
		}

		const accessToken = sign({ email: user.email, role: user.role }, env.JWT_SECRET, {
			subject: String(user.id),
			expiresIn: env.JWT_EXPIRES_IN
		})

		const refreshToken = randomBytes(64).toString('hex')
		const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex')
		const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)

		await this.refreshTokenRepository.create({
			userId: user.id,
			tokenHash: refreshTokenHash,
			expiresAt
		})

		const { password: _password, ...userWithoutPassword } = user

		return {
			user: userWithoutPassword,
			accessToken,
			refreshToken
		}
	}
}

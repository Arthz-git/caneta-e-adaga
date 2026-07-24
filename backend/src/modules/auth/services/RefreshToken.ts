import { randomBytes, createHash } from 'node:crypto'
import { sign } from 'jsonwebtoken'
import { env } from '../../../config/env'
import { AppError } from '../../../shared/errors/AppError'
import type { IUsersRepository } from '../../users/repositories/IUsersRepository'
import type { IRefreshTokenRepository } from '../../refreshToken/repositories/IRefreshTokenRepository'
import type { RefreshTokenDTO } from '../schemas/refreshToken.schema'

export class RefreshTokenService {
	constructor(
		private usersRepository: IUsersRepository,
		private refreshTokenRepository: IRefreshTokenRepository
	) {}

	async execute({ refreshToken }: RefreshTokenDTO) {
		const tokenHash = createHash('sha256').update(refreshToken).digest('hex')

		const storedToken = await this.refreshTokenRepository.getByHash(tokenHash)

		if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
			throw new AppError('Refresh token inválido', 401)
		}

		const user = await this.usersRepository.get(storedToken.userId)

		if (!user) {
			throw new AppError('Refresh token inválido', 401)
		}

		await this.refreshTokenRepository.revoke(tokenHash)

		const accessToken = sign({ email: user.email, role: user.role }, env.JWT_SECRET, {
			subject: String(user.id),
			expiresIn: env.JWT_EXPIRES_IN
		})

		const newRefreshToken = randomBytes(64).toString('hex')
		const newRefreshTokenHash = createHash('sha256').update(newRefreshToken).digest('hex')
		const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)

		await this.refreshTokenRepository.create({
			userId: user.id,
			tokenHash: newRefreshTokenHash,
			expiresAt
		})

		const { password: _password, ...userWithoutPassword } = user

		return {
			user: userWithoutPassword,
			accessToken,
			refreshToken: newRefreshToken
		}
	}
}

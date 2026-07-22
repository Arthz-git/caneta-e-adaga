import { createHash } from 'node:crypto'
import { AppError } from '../../../shared/errors/AppError'
import type { IRefreshTokenRepository } from '../../refreshToken/repositories/IRefreshTokenRepository'
import type { LogoutDTO } from '../schemas/logout.schema'

export class LogoutService {
	constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

	async execute({ refreshToken }: LogoutDTO) {
		const tokenHash = createHash('sha256').update(refreshToken).digest('hex')

		const storedToken = await this.refreshTokenRepository.findByHash(tokenHash)

		if (!storedToken || storedToken.revokedAt) {
			throw new AppError('Refresh token inválido', 401)
		}

		await this.refreshTokenRepository.revoke(tokenHash)
	}
}

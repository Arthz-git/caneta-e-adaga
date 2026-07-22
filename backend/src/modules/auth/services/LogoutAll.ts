import type { IRefreshTokenRepository } from '../../refreshToken/repositories/IRefreshTokenRepository'

export class LogoutAllService {
	constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

	async execute(userId: number) {
		await this.refreshTokenRepository.revokeAllByUserId(userId)
	}
}

import type { RefreshTokenModel } from '../../../generated/prisma/models/RefreshToken'
import { CreateRefreshTokenDTO } from '../schemas/createRefreshToken.schema'

export interface IRefreshTokenRepository {
	create(data: CreateRefreshTokenDTO): Promise<RefreshTokenModel>
	findByHash(tokenHash: string): Promise<RefreshTokenModel | null>
	revoke(tokenHash: string): Promise<void>
	revokeAllByUserId(userId: number): Promise<void>
}

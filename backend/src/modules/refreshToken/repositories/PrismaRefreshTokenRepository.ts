import { prisma } from '../../../database/prisma-client'
import { CreateRefreshTokenDTO } from '../schemas/createRefreshToken.schema'
import { IRefreshTokenRepository } from './IRefreshTokenRepository'

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
	async create(data: CreateRefreshTokenDTO) {
		return prisma.refreshToken.create({ data })
	}

	async getByHash(tokenHash: string) {
		return prisma.refreshToken.findUnique({ where: { tokenHash } })
	}

	async revoke(tokenHash: string) {
		await prisma.refreshToken.update({
			where: { tokenHash },
			data: { revokedAt: new Date() },
		})
	}

	async revokeAllByUserId(userId: number) {
		await prisma.refreshToken.updateMany({
			where: { userId, revokedAt: null },
			data: { revokedAt: new Date() },
		})
	}
}

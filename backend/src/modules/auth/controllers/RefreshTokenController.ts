import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUsersRepository } from '../../users/repositories/PrismaUsersRepository'
import { PrismaRefreshTokenRepository } from '../../refreshToken/repositories/PrismaRefreshTokenRepository'
import { RefreshTokenService } from '../services/RefreshToken'
import { REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions } from '../../../shared/http/cookies/refreshTokenCookie'

export class RefreshTokenController {
	async handle(req: Request, res: Response) {
		try {
			const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE]

			if (!refreshToken) {
				throw new AppError('Refresh token inválido', 401)
			}

			const usersRepository = new PrismaUsersRepository()
			const refreshTokenRepository = new PrismaRefreshTokenRepository()
			const refreshTokenService = new RefreshTokenService(usersRepository, refreshTokenRepository)

			const { refreshToken: newRefreshToken, ...result } = await refreshTokenService.execute({ refreshToken })

			res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, refreshTokenCookieOptions())

			return res.status(200).json(result)
		}
		catch (error) {
			if (error instanceof AppError) {
				return res.status(error.statusCode).json({
					message: error.message
				})
			}

			console.error(error)
			return res.status(500).json({
				message: 'Erro interno do servidor'
			})
		}
	}
}

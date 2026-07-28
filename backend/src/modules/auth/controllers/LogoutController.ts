import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaRefreshTokenRepository } from '../../refreshToken/repositories/PrismaRefreshTokenRepository'
import { LogoutService } from '../services/Logout'
import { REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions } from '../../../shared/http/cookies/refreshTokenCookie'

export class LogoutController {
	async handle(req: Request, res: Response) {
		try {
			const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE]

			if (!refreshToken) {
				throw new AppError('Refresh token inválido', 401)
			}

			const refreshTokenRepository = new PrismaRefreshTokenRepository()
			const logoutService = new LogoutService(refreshTokenRepository)

			await logoutService.execute({ refreshToken })

			res.clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions())

			return res.status(204).send()
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

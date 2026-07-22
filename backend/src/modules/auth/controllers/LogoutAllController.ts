import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaRefreshTokenRepository } from '../../refreshToken/repositories/PrismaRefreshTokenRepository'
import { LogoutAllService } from '../services/LogoutAll'

export class LogoutAllController {
	async handle(req: Request, res: Response) {
		try {
			const refreshTokenRepository = new PrismaRefreshTokenRepository()
			const logoutAllService = new LogoutAllService(refreshTokenRepository)

			await logoutAllService.execute(req.user!.id)

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

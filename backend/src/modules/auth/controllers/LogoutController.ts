import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaRefreshTokenRepository } from '../../refreshToken/repositories/PrismaRefreshTokenRepository'
import { logoutSchema } from '../schemas/logout.schema'
import { LogoutService } from '../services/Logout'

export class LogoutController {
	async handle(req: Request, res: Response) {
		try {
			const data = logoutSchema.parse(req.body)

			const refreshTokenRepository = new PrismaRefreshTokenRepository()
			const logoutService = new LogoutService(refreshTokenRepository)

			await logoutService.execute(data)

			return res.status(204).send()
		}
		catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					message: 'Dados inválidos',
					issues: error.issues
				})
			}

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

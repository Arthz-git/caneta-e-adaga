import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUsersRepository } from '../../users/repositories/PrismaUsersRepository'
import { PrismaRefreshTokenRepository } from '../../refreshToken/repositories/PrismaRefreshTokenRepository'
import { refreshTokenSchema } from '../schemas/refreshToken.schema'
import { RefreshTokenService } from '../services/RefreshToken'

export class RefreshTokenController {
	async handle(req: Request, res: Response) {
		try {
			const data = refreshTokenSchema.parse(req.body)

			const usersRepository = new PrismaUsersRepository()
			const refreshTokenRepository = new PrismaRefreshTokenRepository()
			const refreshTokenService = new RefreshTokenService(usersRepository, refreshTokenRepository)

			const result = await refreshTokenService.execute(data)

			return res.status(200).json(result)
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

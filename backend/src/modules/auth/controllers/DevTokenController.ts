import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUsersRepository } from '../../users/repositories/PrismaUsersRepository'
import { devTokenSchema } from '../schemas/devToken.schema'
import { DevTokenService } from '../services/DevToken'

export class DevTokenController {
	async handle(req: Request, res: Response) {
		try {
			const data = devTokenSchema.parse(req.body)

			const usersRepository = new PrismaUsersRepository()
			const devTokenService = new DevTokenService(usersRepository)

			const result = await devTokenService.execute(data)

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

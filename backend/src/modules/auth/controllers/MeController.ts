import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUsersRepository } from '../../users/repositories/PrismaUsersRepository'
import { GetUserByIdService } from '../../users/services/GetUserByIdService'

export class MeController {
	async handle(req: Request, res: Response) {
		try {
			const usersRepository = new PrismaUsersRepository()
			const getUserByIdService = new GetUserByIdService(usersRepository)

			const user = await getUserByIdService.execute(req.user!.id)

			return res.status(200).json(user)
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

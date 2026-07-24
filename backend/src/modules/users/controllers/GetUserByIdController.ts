import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUsersRepository } from '../repositories/PrismaUsersRepository'
import { getUserByIdSchema } from '../schemas/getUserById.schema'
import { GetUserByIdService } from '../services/GetUserByIdService'

export class GetUserByIdController {
	async handle(req: Request, res: Response) {
		try {
			const { id } = getUserByIdSchema.parse(req.params)

			const usersRepository = new PrismaUsersRepository()
			const getUserByIdService = new GetUserByIdService(usersRepository)

			const user = await getUserByIdService.execute(id)

			return res.status(200).json(user)
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ message: 'Dados inválidos', issues: error.issues })
			}

			if (error instanceof AppError) {
				return res.status(error.statusCode).json({ message: error.message })
			}

			console.error(error)
			return res.status(500).json({ message: 'Erro interno do servidor' })
		}
	}
}

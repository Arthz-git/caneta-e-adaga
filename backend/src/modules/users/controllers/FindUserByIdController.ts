import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUsersRepository } from '../repositories/PrismaUsersRepository'
import { findUserByIdSchema } from '../schemas/findUserById.schema'
import { FindUserByIdService } from '../services/FindUserByIdService'

export class FindUserByIdController {
	async handle(req: Request, res: Response) {
		try {
			const { id } = findUserByIdSchema.parse(req.params)

			const usersRepository = new PrismaUsersRepository()
			const findUserByIdService = new FindUserByIdService(usersRepository)

			const user = await findUserByIdService.execute(id)

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

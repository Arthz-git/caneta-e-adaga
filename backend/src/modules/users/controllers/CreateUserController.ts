import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUsersRepository } from '../repositories/PrismaUsersRepository'
import { createUserSchema } from '../schemas/createUser.schema'
import { CreateUserService } from '../services/CreateUserService'

export class CreateUserController {
	async handle(req: Request, res: Response) {
		try {
			const data = createUserSchema.parse(req.body)

			const usersRepository = new PrismaUsersRepository()
			const createUserService = new CreateUserService(usersRepository)

			const user = await createUserService.execute(data)

			return res.status(201).json(user)
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

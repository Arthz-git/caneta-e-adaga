import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUsersRepository } from '../repositories/PrismaUsersRepository'
import { searchUsersByNameSchema } from '../schemas/searchUsersByName.schema'
import { SearchUsersByNameService } from '../services/SearchUsersByNameService'

export class SearchUsersByNameController {
	async handle(req: Request, res: Response) {
		try {
			const data = searchUsersByNameSchema.parse(req.query)

			const usersRepository = new PrismaUsersRepository()
			const searchUsersByNameService = new SearchUsersByNameService(usersRepository)

			const users = await searchUsersByNameService.execute(data)

			return res.status(200).json(users)
		}
		catch (error) {
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

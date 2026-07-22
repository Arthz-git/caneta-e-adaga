import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { createUserCharacterSchema } from '../schemas/createUserCharacter.schema'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import { PrismaUserCharactersRepository } from '../repositories/PrismaUserCharactersRepository'
import { CreateUserCharacterService } from '../services/CreateUserCharacterService'
import { PrismaUsersRepository } from '../../users/repositories/PrismaUsersRepository'

export class CreateUserCharacterController {
	async handle(req: Request, res: Response) {
		try {
			const input = createUserCharacterSchema.parse(req.body)
			const data: CreateUserCharacterDTO = { ...input, userId: req.user!.id }

			const usersRepository = new PrismaUsersRepository()
			const userCharactersRepository = new PrismaUserCharactersRepository()
			const createUserCharacterService = new CreateUserCharacterService(userCharactersRepository, usersRepository)

			const userCharacter = await createUserCharacterService.execute(data)

			return res.status(201).json(userCharacter)
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
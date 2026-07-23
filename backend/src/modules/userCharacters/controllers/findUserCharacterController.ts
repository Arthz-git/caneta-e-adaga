import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUserCharactersRepository } from '../repositories/PrismaUserCharactersRepository'
import { FindUserCharacterService } from '../services/FindUserCharacterService'
import { findUserCharacterSchema } from '../schemas/findUserCharacter.schema'
import { ZodError } from 'zod'

export class FindUserCharacterController {
	async handle(req: Request, res: Response) {
		try {
			const data = findUserCharacterSchema.parse(req.params)

			const userCharactersRepository = new PrismaUserCharactersRepository()
			const findUserCharacterService = new FindUserCharacterService(userCharactersRepository)

			const userCharacter = await findUserCharacterService.execute(data)

			return res.status(200).json(userCharacter)
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

import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUserCharactersRepository } from '../repositories/PrismaUserCharactersRepository'
import { FindAllUserCharacterByUserIdService } from '../services/FindAllUserCharacterByUserIdService'
import { findAllUserCharacterByUserIdSchema } from '../schemas/findAllUserCharacterByUserId.schema'
import { ZodError } from 'zod'

export class FindAllUserCharacterByUserIdController {
	async handle(req: Request, res: Response) {
		try {
			const data = findAllUserCharacterByUserIdSchema.parse(req.params)

			const userCharactersRepository = new PrismaUserCharactersRepository()
			const findAllUserCharacterByUserIdService = new FindAllUserCharacterByUserIdService(userCharactersRepository)

			const userCharacters = await findAllUserCharacterByUserIdService.execute(data)

			return res.status(200).json(userCharacters)
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

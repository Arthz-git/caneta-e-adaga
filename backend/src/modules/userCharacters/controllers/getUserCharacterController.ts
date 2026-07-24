import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUserCharactersRepository } from '../repositories/PrismaUserCharactersRepository'
import { GetUserCharacterService } from '../services/GetUserCharacterService'
import { getUserCharacterSchema } from '../schemas/getUserCharacter.schema'
import { ZodError } from 'zod'

export class GetUserCharacterController {
	async handle(req: Request, res: Response) {
		try {
			const data = getUserCharacterSchema.parse(req.params)

			const userCharactersRepository = new PrismaUserCharactersRepository()
			const getUserCharacterService = new GetUserCharacterService(userCharactersRepository)

			const userCharacter = await getUserCharacterService.execute(data)

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

import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUserCharactersRepository } from '../repositories/PrismaUserCharactersRepository'
import { UpdateUserCharacterService } from '../services/UpdateUserCharacterService'
import { updateUserCharacterSchema } from '../schemas/updateUserCharacter.schema'
import { ZodError } from 'zod'

export class UpdateUserCharacterController {
	async handle(req: Request, res: Response) {
		try {
			const data = updateUserCharacterSchema.parse(req.body)

			const userCharactersRepository = new PrismaUserCharactersRepository()
			const updateUserCharacterService = new UpdateUserCharacterService(userCharactersRepository)

			await updateUserCharacterService.execute(data, req.user!.id)

			return res.status(204).send()
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

import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaUserCharactersRepository } from '../repositories/PrismaUserCharactersRepository'
import { DeleteUserCharacterService } from '../services/DeleteUserCharacterService'
import { deleteUserCharacterSchema } from '../schemas/deleteUserCharacter.schema'
import { ZodError } from 'zod'

export class DeleteUserCharacterController {
	async handle(req: Request, res: Response) {
		try {
			const data = deleteUserCharacterSchema.parse(req.params)

			const userCharactersRepository = new PrismaUserCharactersRepository()
			const deleteUserCharacterService = new DeleteUserCharacterService(userCharactersRepository)

			await deleteUserCharacterService.execute(data, req.user!.id)

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

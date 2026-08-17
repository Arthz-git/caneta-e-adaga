import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaAmizadesRepository } from '../repositories/PrismaAmizadesRepository'
import { deleteAmizadeSchema } from '../schemas/deleteAmizade.schema'
import { DeleteAmizadeService } from '../services/DeleteAmizadeService'

export class DeleteAmizadeController {
	async handle(req: Request, res: Response) {
		try {
			const data = deleteAmizadeSchema.parse(req.params)

			const amizadesRepository = new PrismaAmizadesRepository()
			const deleteAmizadeService = new DeleteAmizadeService(amizadesRepository)

			await deleteAmizadeService.execute(data, req.user!.id)

			return res.status(204).json()
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

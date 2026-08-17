import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaAmizadesRepository } from '../repositories/PrismaAmizadesRepository'
import { createAmizadeSchema } from '../schemas/createAmizade.schema'
import type { CreateAmizadeDTO } from '../schemas/createAmizade.schema'
import { CreateAmizadeService } from '../services/CreateAmizadeService'

export class CreateAmizadeController {
	async handle(req: Request, res: Response) {
		try {
			const input = createAmizadeSchema.parse(req.body)
			const data: CreateAmizadeDTO = { ...input, userId: req.user!.id }

			const amizadesRepository = new PrismaAmizadesRepository()
			const createAmizadeService = new CreateAmizadeService(amizadesRepository)

			const amizade = await createAmizadeService.execute(data)

			return res.status(201).json(amizade)
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

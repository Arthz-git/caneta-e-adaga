import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaAmizadesRepository } from '../repositories/PrismaAmizadesRepository'
import { getAmizadeSchema } from '../schemas/getAmizade.schema'
import { GetAmizadeService } from '../services/GetAmizadeService'

export class GetAmizadeController {
	async handle(req: Request, res: Response) {
		try {
			const data = getAmizadeSchema.parse(req.params)

			const amizadesRepository = new PrismaAmizadesRepository()
			const getAmizadeService = new GetAmizadeService(amizadesRepository)

			const amizade = await getAmizadeService.execute(data, req.user!.id)

			return res.status(200).json(amizade)
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

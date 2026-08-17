import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaAmizadesRepository } from '../repositories/PrismaAmizadesRepository'
import { getAllAmizadesPaginatedSchema } from '../schemas/getAllAmizadesPaginated.schema'
import { GetAllAmizadesService } from '../services/GetAllAmizadesService'

export class GetAllAmizadesController {
	async handle(req: Request, res: Response) {
		try {
			const data = getAllAmizadesPaginatedSchema.parse(req.query)

			const amizadesRepository = new PrismaAmizadesRepository()
			const getAllAmizadesService = new GetAllAmizadesService(amizadesRepository)

			const result = await getAllAmizadesService.execute(data, req.user!.id)

			return res.status(200).json(result)
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

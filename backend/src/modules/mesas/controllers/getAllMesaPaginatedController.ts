import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../repositories/PrismaMesasRepository'
import { getAllMesaPaginatedSchema } from '../schemas/getAllMesaPaginated.schema'
import { GetAllMesaPaginatedService } from '../services/GetAllMesaPaginatedService'

export class GetAllMesaPaginatedController {
	async handle(req: Request, res: Response) {
		try {
			const data = getAllMesaPaginatedSchema.parse(req.query)

			const mesaRepository = new PrismaMesasRepository()
			const getAllMesaPaginatedService = new GetAllMesaPaginatedService(mesaRepository)

			const result = await getAllMesaPaginatedService.execute(data, req.user!.id)

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

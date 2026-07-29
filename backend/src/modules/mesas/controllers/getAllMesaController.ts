import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../repositories/PrismaMesasRepository'
import { GetAllMesaService } from '../services/GetAllMesaService'

export class GetAllMesaController {
	async handle(req: Request, res: Response) {
		try {
			const mesaRepository = new PrismaMesasRepository()
			const getAllMesaService = new GetAllMesaService(mesaRepository)

			const mesas = await getAllMesaService.execute()

			return res.status(200).json(mesas)
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
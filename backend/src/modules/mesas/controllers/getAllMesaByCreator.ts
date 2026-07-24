import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../repositories/PrismaMesasRepository'
import { getAllMesaByCreatorSchema } from '../schemas/getAllMesaByCreator.schema'
import { GetAllMesaByCreatorService } from '../services/GetAllMesaByCreatorService'

export class GetAllMesaByCreatorController {
	async handle(req: Request, res: Response) {
		try {
			const data = getAllMesaByCreatorSchema.parse(req.params)

			const mesaRepository = new PrismaMesasRepository()
			const getAllMesaByCreatorService = new GetAllMesaByCreatorService(mesaRepository)

			const mesa = await getAllMesaByCreatorService.execute(data, req.user!.id)

			return res.status(200).json(mesa)
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
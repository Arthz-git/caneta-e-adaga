import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../repositories/PrismaMesasRepository'
import { deleteMesaSchema } from '../schemas/deleteMesa.schema'
import { DeleteMesaService } from '../services/DeleteMesaService'

export class DeleteMesaController {
	async handle(req: Request, res: Response) {
		try {
			const data = deleteMesaSchema.parse(req.params)

			const mesaRepository = new PrismaMesasRepository()
			const deleteMesaService = new DeleteMesaService(mesaRepository)

			await deleteMesaService.execute(data, req.user!.id)

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
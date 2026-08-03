import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../repositories/PrismaMesasRepository'
import { updateMesaSchema } from '../schemas/updateMesa.schema'
import type { UpdateMesaDTO } from '../schemas/updateMesa.schema'
import { UpdateMesaService } from '../services/UpdateMesaService'

export class UpdateMesaController {
	async handle(req: Request, res: Response) {
		try {
			const parsed = updateMesaSchema.parse({ ...req.body, id: req.params.id })
			const data: UpdateMesaDTO = { ...parsed, imageUrl: req.file?.path }

			const mesaRepository = new PrismaMesasRepository()
			const updateMesaService = new UpdateMesaService(mesaRepository)

			const mesa = await updateMesaService.execute(data, req.user!.id)

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
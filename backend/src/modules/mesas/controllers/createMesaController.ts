import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { createMesaSchema } from '../schemas/createMesa.schema'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'
import { PrismaMesasRepository } from '../repositories/PrismaMesasRepository'
import { CreateMesaService } from '../services/CreateMesaService'

export class CreateMesaController {
	async handle(req: Request, res: Response) {
		try {
			const input = createMesaSchema.parse(req.body)
			const data: CreateMesaDTO = { ...input, createdBy: req.user!.id }

			const mesaRepository = new PrismaMesasRepository()
			const createMesaService = new CreateMesaService(mesaRepository)

			const mesa = await createMesaService.execute(data)

			return res.status(201).json(mesa)
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
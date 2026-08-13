import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaSolicitacoesRepository } from '../repositories/PrismaSolicitacoesRepository'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'
import { getMySolicitacaoByMesaIdSchema } from '../schemas/getMySolicitacaoByMesaId.schema'
import { GetMySolicitacaoByMesaIdService } from '../services/GetMySolicitacaoByMesaIdService'

export class GetMySolicitacaoByMesaIdController {
	async handle(req: Request, res: Response) {
		try {
			const data = getMySolicitacaoByMesaIdSchema.parse(req.params)

			const solicitacoesRepository = new PrismaSolicitacoesRepository()
			const mesaRepository = new PrismaMesasRepository()
			const getMySolicitacaoByMesaId = new GetMySolicitacaoByMesaIdService(solicitacoesRepository, mesaRepository)

			const result = await getMySolicitacaoByMesaId.execute(data, req.user!.id)

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

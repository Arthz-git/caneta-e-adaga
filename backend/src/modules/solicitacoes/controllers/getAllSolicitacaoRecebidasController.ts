import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaSolicitacoesRepository } from '../repositories/PrismaSolicitacoesRepository'
import { getAllSolicitacaoPaginatedSchema } from '../schemas/getAllSolicitacaoPaginated.schema'
import { GetAllSolicitacaoRecebidasService } from '../services/GetAllSolicitacaoRecebidasService'

export class GetAllSolicitacaoRecebidasController {
	async handle(req: Request, res: Response) {
		try {
			const data = getAllSolicitacaoPaginatedSchema.parse(req.query)

			const solicitacoesRepository = new PrismaSolicitacoesRepository()
			const getAllSolicitacaoRecebidasService = new GetAllSolicitacaoRecebidasService(solicitacoesRepository)

			const result = await getAllSolicitacaoRecebidasService.execute(data, req.user!.id)

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

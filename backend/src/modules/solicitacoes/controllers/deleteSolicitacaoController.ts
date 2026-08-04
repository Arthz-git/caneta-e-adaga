import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaSolicitacoesRepository } from '../repositories/PrismaSolicitacoesRepository'
import { deleteSolicitacaoSchema } from '../schemas/deleteSolicitacao.schema'
import { DeleteSolicitacaoService } from '../services/DeleteSolicitacaoService'

export class DeleteSolicitacaoController {
	async handle(req: Request, res: Response) {
		try {
			const data = deleteSolicitacaoSchema.parse(req.params)

			const solicitacoesRepository = new PrismaSolicitacoesRepository()
			const deleteSolicitacaoService = new DeleteSolicitacaoService(solicitacoesRepository)

			await deleteSolicitacaoService.execute(data, req.user!.id)

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

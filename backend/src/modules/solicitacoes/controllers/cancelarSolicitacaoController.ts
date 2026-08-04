import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaSolicitacoesRepository } from '../repositories/PrismaSolicitacoesRepository'
import { cancelarSolicitacaoSchema } from '../schemas/cancelarSolicitacao.schema'
import { CancelarSolicitacaoService } from '../services/CancelarSolicitacaoService'

export class CancelarSolicitacaoController {
	async handle(req: Request, res: Response) {
		try {
			const data = cancelarSolicitacaoSchema.parse(req.params)

			const solicitacoesRepository = new PrismaSolicitacoesRepository()
			const cancelarSolicitacaoService = new CancelarSolicitacaoService(solicitacoesRepository)

			const solicitacao = await cancelarSolicitacaoService.execute(data, req.user!.id)

			return res.status(200).json(solicitacao)
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

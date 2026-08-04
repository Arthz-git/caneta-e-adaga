import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaSolicitacoesRepository } from '../repositories/PrismaSolicitacoesRepository'
import { getSolicitacaoSchema } from '../schemas/getSolicitacao.schema'
import { GetSolicitacaoService } from '../services/GetSolicitacaoService'

export class GetSolicitacaoController {
	async handle(req: Request, res: Response) {
		try {
			const data = getSolicitacaoSchema.parse(req.params)

			const solicitacoesRepository = new PrismaSolicitacoesRepository()
			const getSolicitacaoService = new GetSolicitacaoService(solicitacoesRepository)

			const solicitacao = await getSolicitacaoService.execute(data, req.user!.id)

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

import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaNotificacoesRepository } from '../../notificacoes/repositories/PrismaNotificacoesRepository'
import { PrismaSolicitacoesRepository } from '../repositories/PrismaSolicitacoesRepository'
import { responderSolicitacaoSchema } from '../schemas/responderSolicitacao.schema'
import { ResponderSolicitacaoService } from '../services/ResponderSolicitacaoService'

export class ResponderSolicitacaoController {
	async handle(req: Request, res: Response) {
		try {
			const data = responderSolicitacaoSchema.parse({ ...req.body, id: req.params.id })

			const solicitacoesRepository = new PrismaSolicitacoesRepository()
			const notificacoesRepository = new PrismaNotificacoesRepository()
			const responderSolicitacaoService = new ResponderSolicitacaoService(solicitacoesRepository, notificacoesRepository)

			const solicitacao = await responderSolicitacaoService.execute(data, req.user!.id)

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

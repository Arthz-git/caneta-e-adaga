import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { createSolicitacaoSchema } from '../schemas/createSolicitacao.schema'
import type { CreateSolicitacaoDTO } from '../schemas/createSolicitacao.schema'
import { PrismaNotificacoesRepository } from '../../notificacoes/repositories/PrismaNotificacoesRepository'
import { PrismaSolicitacoesRepository } from '../repositories/PrismaSolicitacoesRepository'
import { CreateSolicitacaoService } from '../services/CreateSolicitacaoService'

export class CreateSolicitacaoController {
	async handle(req: Request, res: Response) {
		try {
			const input = createSolicitacaoSchema.parse(req.body)
			const data: CreateSolicitacaoDTO = { ...input, solicitanteId: req.user!.id }

			const solicitacoesRepository = new PrismaSolicitacoesRepository()
			const notificacoesRepository = new PrismaNotificacoesRepository()
			const createSolicitacaoService = new CreateSolicitacaoService(solicitacoesRepository, notificacoesRepository)

			const solicitacao = await createSolicitacaoService.execute(data)

			return res.status(201).json(solicitacao)
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

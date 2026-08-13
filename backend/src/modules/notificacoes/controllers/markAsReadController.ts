import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaNotificacoesRepository } from '../repositories/PrismaNotificacoesRepository'
import { notificacaoIdSchema } from '../schemas/notificacaoId.schema'
import { MarkAsReadService } from '../services/MarkAsReadService'

export class MarkAsReadController {
	async handle(req: Request, res: Response) {
		try {
			const data = notificacaoIdSchema.parse(req.params)

			const notificacoesRepository = new PrismaNotificacoesRepository()
			const markAsReadService = new MarkAsReadService(notificacoesRepository)

			const notificacao = await markAsReadService.execute(data, req.user!.id)

			return res.status(200).json(notificacao)
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

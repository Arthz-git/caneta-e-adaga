import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaNotificacoesRepository } from '../repositories/PrismaNotificacoesRepository'
import { MarkAllAsReadService } from '../services/MarkAllAsReadService'

export class MarkAllAsReadController {
	async handle(req: Request, res: Response) {
		try {
			const notificacoesRepository = new PrismaNotificacoesRepository()
			const markAllAsReadService = new MarkAllAsReadService(notificacoesRepository)

			await markAllAsReadService.execute(req.user!.id)

			return res.status(204).json()
		}
		catch (error) {
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

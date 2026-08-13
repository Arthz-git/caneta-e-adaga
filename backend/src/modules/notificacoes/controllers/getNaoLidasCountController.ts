import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaNotificacoesRepository } from '../repositories/PrismaNotificacoesRepository'
import { GetNaoLidasCountService } from '../services/GetNaoLidasCountService'

export class GetNaoLidasCountController {
	async handle(req: Request, res: Response) {
		try {
			const notificacoesRepository = new PrismaNotificacoesRepository()
			const getNaoLidasCountService = new GetNaoLidasCountService(notificacoesRepository)

			const result = await getNaoLidasCountService.execute(req.user!.id)

			return res.status(200).json(result)
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

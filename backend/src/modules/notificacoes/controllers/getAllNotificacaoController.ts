import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaNotificacoesRepository } from '../repositories/PrismaNotificacoesRepository'
import { getAllNotificacaoPaginatedSchema } from '../schemas/getAllNotificacaoPaginated.schema'
import { GetAllNotificacaoService } from '../services/GetAllNotificacaoService'

export class GetAllNotificacaoController {
	async handle(req: Request, res: Response) {
		try {
			const data = getAllNotificacaoPaginatedSchema.parse(req.query)

			const notificacoesRepository = new PrismaNotificacoesRepository()
			const getAllNotificacaoService = new GetAllNotificacaoService(notificacoesRepository)

			const result = await getAllNotificacaoService.execute(data, req.user!.id)

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

import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaPlayersRepository } from '../repositories/PrismaPlayersRepository'
import { deletePlayerSchema } from '../schemas/deletePlayer.schema'
import { DeletePlayerService } from '../services/DeletePlayerService'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'
import { PrismaNotificacoesRepository } from '../../notificacoes/repositories/PrismaNotificacoesRepository'

export class DeletePlayerController {
	async handle(req: Request, res: Response) {
		try {
			const data = deletePlayerSchema.parse(req.params)

			const mesaRepository = new PrismaMesasRepository()
			const playerRepository = new PrismaPlayersRepository()
			const notificacoesRepository = new PrismaNotificacoesRepository()
			const deletePlayerService = new DeletePlayerService(playerRepository, mesaRepository, notificacoesRepository)

			await deletePlayerService.execute(data, req.user!.id)

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
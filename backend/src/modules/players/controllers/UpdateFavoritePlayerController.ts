import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaPlayersRepository } from '../../players/repositories/PrismaPlayersRepository'
import { updateFavoritePlayerSchema } from '../schemas/updateFavoritePlayer.schema'
import { UpdateFavoritePlayerService } from '../services/UpdateFavoritePlayerService'

export class UpdateFavoritePlayerController {
	async handle(req: Request, res: Response) {
		try {
			const data = updateFavoritePlayerSchema.parse({ ...req.body, id: req.params.id })

			const playersRepository = new PrismaPlayersRepository()

			const updateFavoritePlayerService = new UpdateFavoritePlayerService(playersRepository)

			const player = await updateFavoritePlayerService.execute(data, req.user!.id)

			return res.status(200).json(player)
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
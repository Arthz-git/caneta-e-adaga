import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaPlayersRepository } from '../../players/repositories/PrismaPlayersRepository'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'
import { updateRolePlayerSchema } from '../schemas/updateRolePlayer.schema'
import { UpdateRolePlayerService } from '../services/UpdateRolePlayerService'

export class UpdateRolePlayerController {
	async handle(req: Request, res: Response) {
		try {
			const data = updateRolePlayerSchema.parse({ ...req.body, id: req.params.id })

			const playersRepository = new PrismaPlayersRepository()
			const mesasRepository = new PrismaMesasRepository()

			const updateRolePlayerService = new UpdateRolePlayerService(
				playersRepository,
				mesasRepository
			)

			const player = await updateRolePlayerService.execute(data, req.user!.id)

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
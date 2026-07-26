import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaPlayersRepository } from '../../players/repositories/PrismaPlayersRepository'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'
import { getPlayersByMesaIdSchema } from '../schemas/getPlayersByMesaId.schema'
import { GetPlayersByMesaIdService } from '../services/GetPlayersByMesaIdService'

export class GetPlayersByMesaIdController {
	async handle(req: Request, res: Response) {
		try {
			const data = getPlayersByMesaIdSchema.parse(req.params)

			const playersRepository = new PrismaPlayersRepository()
			const mesasRepository = new PrismaMesasRepository()

			const getPlayersByMesaIdService = new GetPlayersByMesaIdService(
				playersRepository,
				mesasRepository
			)

			const players = await getPlayersByMesaIdService.execute(data, req.user!.id)

			return res.status(200).json(players)
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
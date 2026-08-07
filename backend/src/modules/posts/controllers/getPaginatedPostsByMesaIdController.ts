import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'
import { PrismaPlayersRepository } from '../../players/repositories/PrismaPlayersRepository'
import { PrismaPostsRepository } from '../repositories/PrismaPostsRepository'
import { getPaginatedPostsByMesaIdSchema } from '../schemas/getPaginatedPostsByMesaId.schema'
import { GetPaginatedPostsByMesaIdService } from '../services/GetPaginatedPostsByMesaIdService'

export class GetPaginatedPostsByMesaIdController {
	async handle(req: Request, res: Response) {
		try {
			const data = getPaginatedPostsByMesaIdSchema.parse({ ...req.params, ...req.query })

			const postsRepository = new PrismaPostsRepository()
			const mesasRepository = new PrismaMesasRepository()
			const playersRepository = new PrismaPlayersRepository()

			const getPaginatedPostsByMesaIdService = new GetPaginatedPostsByMesaIdService(
				postsRepository,
				mesasRepository,
				playersRepository
			)

			const result = await getPaginatedPostsByMesaIdService.execute(data, req.user!.id)

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

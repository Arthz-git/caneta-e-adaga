import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'
import { PrismaPlayersRepository } from '../../players/repositories/PrismaPlayersRepository'
import { PrismaPostsRepository } from '../repositories/PrismaPostsRepository'
import { getAllPostsByMesaIdSchema } from '../schemas/getAllPostsByMesaId.schema'
import { GetAllPostsByMesaIdService } from '../services/GetAllPostsByMesaIdService'

export class GetAllPostsByMesaIdController {
	async handle(req: Request, res: Response) {
		try {
			const data = getAllPostsByMesaIdSchema.parse(req.params)

			const postsRepository = new PrismaPostsRepository()
			const mesasRepository = new PrismaMesasRepository()
			const playersRepository = new PrismaPlayersRepository()

			const getAllPostsByMesaIdService = new GetAllPostsByMesaIdService(
				postsRepository,
				mesasRepository,
				playersRepository
			)

			const posts = await getAllPostsByMesaIdService.execute(data, req.user!.id)

			return res.status(200).json(posts)
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

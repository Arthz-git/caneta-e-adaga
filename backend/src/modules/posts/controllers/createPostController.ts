import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'
import { PrismaNotificacoesRepository } from '../../notificacoes/repositories/PrismaNotificacoesRepository'
import { PrismaPlayersRepository } from '../../players/repositories/PrismaPlayersRepository'
import { PrismaUserCharactersRepository } from '../../userCharacters/repositories/PrismaUserCharactersRepository'
import { PrismaPostsRepository } from '../repositories/PrismaPostsRepository'
import { createPostSchema } from '../schemas/createPost.schema'
import { CreatePostService } from '../services/CreatePostService'

export class CreatePostController {
	async handle(req: Request, res: Response) {
		try {
			const data = createPostSchema.parse(req.body)

			const postsRepository = new PrismaPostsRepository()
			const mesasRepository = new PrismaMesasRepository()
			const playersRepository = new PrismaPlayersRepository()
			const userCharactersRepository = new PrismaUserCharactersRepository()
			const notificacoesRepository = new PrismaNotificacoesRepository()

			const createPostService = new CreatePostService(
				postsRepository,
				mesasRepository,
				playersRepository,
				userCharactersRepository,
				notificacoesRepository
			)

			const post = await createPostService.execute({ ...data, userId: req.user!.id })

			return res.status(201).json(post)
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

import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { createPlayerSchema } from '../schemas/createPlayer.schema'
import { CreatePlayerService } from '../services/CreatePlayerService'
import { PrismaPlayersRepository } from '../../players/repositories/PrismaPlayersRepository'
import { PrismaUsersRepository } from '../../users/repositories/PrismaUsersRepository'
import { PrismaUserCharactersRepository } from '../../userCharacters/repositories/PrismaUserCharactersRepository'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'

export class CreatePlayerController {
	async handle(req: Request, res: Response) {
		try {
			const data = createPlayerSchema.parse(req.body)

			const playersRepository = new PrismaPlayersRepository()
			const usersRepository = new PrismaUsersRepository()
			const mesasRepository = new PrismaMesasRepository()
			const userCharactersRepository = new PrismaUserCharactersRepository()

			const createPlayerService = new CreatePlayerService(
				playersRepository,
				usersRepository,
				mesasRepository,
				userCharactersRepository
			)

			const player = await createPlayerService.execute(data, req.user!.id)

			return res.status(201).json(player)
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
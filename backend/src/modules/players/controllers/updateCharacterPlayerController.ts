import type { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../../shared/errors/AppError'
import { PrismaMesasRepository } from '../../mesas/repositories/PrismaMesasRepository'
import { PrismaPlayersRepository } from '../../players/repositories/PrismaPlayersRepository'
import { PrismaUserCharactersRepository } from '../../userCharacters/repositories/PrismaUserCharactersRepository'
import { updateCharacterPlayerSchema } from '../schemas/updateCharacterPlayer.schema'
import { UpdateCharacterPlayerService } from '../services/UpdateCharacterPlayerService'

export class UpdateCharacterPlayerController {
	async handle(req: Request, res: Response) {
		try {
			const data = updateCharacterPlayerSchema.parse({ ...req.body, id: req.params.id })

			const playersRepository = new PrismaPlayersRepository()
			const userCharactersRepository = new PrismaUserCharactersRepository()
			const mesasRepository = new PrismaMesasRepository()

			const updateCharacterPlayerService = new UpdateCharacterPlayerService(playersRepository, userCharactersRepository, mesasRepository)

			const player = await updateCharacterPlayerService.execute(data, req.user!.id)

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
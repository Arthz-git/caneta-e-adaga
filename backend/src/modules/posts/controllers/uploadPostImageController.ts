import type { Request, Response } from 'express'
import { AppError } from '../../../shared/errors/AppError'

export class UploadPostImageController {
	async handle(req: Request, res: Response) {
		try {
			if (!req.file) {
				throw new AppError('Nenhuma imagem foi enviada', 400)
			}

			return res.status(201).json({ url: req.file.path })
		}
		catch (error) {
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

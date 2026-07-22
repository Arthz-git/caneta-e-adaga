import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { env } from '../../../config/env'
import { AppError } from '../../errors/AppError'
import type { RoleValue } from '../../constants/roles'

interface TokenPayload {
	sub: string
	email: string
	role: RoleValue
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization

	if (!authHeader) {
		throw new AppError('Token não informado', 401)
	}

	const [, token] = authHeader.split(' ')

	if (!token) {
		throw new AppError('Token mal formatado', 401)
	}

	try {
		const { sub, email, role } = verify(token, env.JWT_SECRET) as TokenPayload

		req.user = { id: Number(sub), email, role }

		return next()
	} catch {
		throw new AppError('Token inválido', 401)
	}
}

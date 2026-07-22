import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../errors/AppError'
import type { RoleValue } from '../../constants/roles'

export function authorize(...allowedRoles: RoleValue[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			throw new AppError('Não autenticado', 401)
		}

		if (!allowedRoles.includes(req.user.role)) {
			throw new AppError('Você não tem permissão para acessar este recurso', 403)
		}

		return next()
	}
}

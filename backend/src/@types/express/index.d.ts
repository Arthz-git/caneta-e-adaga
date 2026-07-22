import type { RoleValue } from '../../shared/constants/roles'

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: number
				email: string
				role: RoleValue
			}
		}
	}
}

export {}

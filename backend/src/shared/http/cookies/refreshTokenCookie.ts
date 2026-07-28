import type { CookieOptions } from 'express'
import { env } from '../../../config/env'

export const REFRESH_TOKEN_COOKIE = 'refreshToken'

export function refreshTokenCookieOptions(): CookieOptions {
	const isProduction = env.NODE_ENV === 'production'

	return {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? 'none' : 'lax',
		path: '/auth',
		maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
	}
}

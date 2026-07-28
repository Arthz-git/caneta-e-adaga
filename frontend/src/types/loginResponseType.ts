import type { UserBackend } from './userType'

interface LoginResponseType {
	user: UserBackend
	accessToken: string
}

export type {
	LoginResponseType
} 
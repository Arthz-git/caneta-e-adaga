
import type { UserBackend } from './userType'

interface RegisterParams {
	name: string
	email: string
	password: string
}

interface RegisterResponse extends UserBackend {
}

export type {
	RegisterParams,
	RegisterResponse
}
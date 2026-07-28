
interface UserType {
	id: number
	username: string
	email: string
	role: number
	accessToken: string
}

interface UserBackend {
	id: number
	name: string
	email: string
	role: number
	createdAt: Date
	updatedAt: Date
}

export type {
	UserType,
	UserBackend
}
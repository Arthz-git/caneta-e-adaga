export const Role = {
	ADMIN: 1000,
	USER: 200
} as const

export type RoleValue = (typeof Role)[keyof typeof Role]

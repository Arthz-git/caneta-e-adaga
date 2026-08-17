import type { UserBackend } from '@/types/userType'
import type { UserSearchResult } from '@/types/userSearchTypes'
import api from './api'

async function searchUsersByName(name: string) {
	const response = await api.get<UserSearchResult[]>('/users/search', { params: { name } })

	return response.data
}

async function getUserById(id: number) {
	const response = await api.get<UserBackend>(`/users/${id}`)

	return response.data
}

export {
	searchUsersByName,
	getUserById
}

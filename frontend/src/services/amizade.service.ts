import type { AmizadeResponse, CreateAmizadeParams, GetAllAmizadeParams, PaginatedAmizadeResponse } from '@/types/amizadeTypes'
import api from './api'

async function createAmizade(params: CreateAmizadeParams) {
	const response = await api.post<AmizadeResponse>('/amizades', params)

	return response.data
}

async function getAllAmizades(params: GetAllAmizadeParams = {}) {
	const response = await api.get<PaginatedAmizadeResponse>('/amizades', { params })

	return response.data
}

async function getAmizade(id: number) {
	const response = await api.get<AmizadeResponse>(`/amizades/${id}`)

	return response.data
}

async function deleteAmizade(id: number) {
	await api.delete(`/amizades/${id}`)
}

export {
	createAmizade,
	getAllAmizades,
	getAmizade,
	deleteAmizade
}

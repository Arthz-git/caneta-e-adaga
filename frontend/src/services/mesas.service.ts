
import type { MesaResponse, PaginatedMesaResponse } from '@/types/mesaTypes'
import api from './api'

interface CreateMesaParams {
	title: string
	description: string
	isPrivate: boolean
	allowSpectators: boolean
	maxPlayers: number
	image?: File
}

async function getAllMesa() {
	const mesas = await api.get<MesaResponse[]>('/mesas')

	return mesas.data
}

async function createMesa(newMesa: CreateMesaParams) {
	const { image, ...data } = newMesa

	const formData = new FormData()
	Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)))
	if (image) formData.append('image', image)

	const mesa = await api.post<MesaResponse>('/mesas', formData)

	return mesa.data
}

interface GetAllMesaPaginatedParams {
	page?: number
	limit?: number
	search?: string
}

async function getAllMesaPaginated(params: GetAllMesaPaginatedParams = {}) {
	const mesas = await api.get<PaginatedMesaResponse>('/mesas/paginated', { params })

	return mesas.data
}

export {
	getAllMesa,
	getAllMesaPaginated,
	createMesa
}
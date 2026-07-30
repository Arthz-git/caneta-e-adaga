
import type { MesaResponse, PaginatedMesaResponse } from '@/types/mesaTypes'
import api from './api'

async function getAllMesa() {
	const mesas = await api.get<MesaResponse[]>('/mesas')

	return mesas.data
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
	getAllMesaPaginated
}
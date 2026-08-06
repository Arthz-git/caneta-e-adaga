
import type {
	CreateMesaParams,
	GetAllMesaPaginatedParams,
	GetMesaInfoResponse,
	MesaResponse,
	PaginatedMesaResponse
} from '@/types/mesaTypes'
import api from './api'

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

async function getAllMesaPaginated(params: GetAllMesaPaginatedParams = {}) {
	const mesas = await api.get<PaginatedMesaResponse>('/mesas/paginated', { params })

	return mesas.data
}

async function getMesaInfo(mesaId: number) {
	const mesa = await api.get<GetMesaInfoResponse>(`/mesas/${mesaId}`)

	return mesa.data
}

export {
	getAllMesa,
	getAllMesaPaginated,
	createMesa,
	getMesaInfo
}
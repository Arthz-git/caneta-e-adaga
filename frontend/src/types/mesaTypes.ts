
interface MesaResponse {
	id: number
	title: string
	description: string
	createdBy: number
	createdAt: Date
	updatedAt: Date,
	creator: {
		id: number
		name: string
	},
	_count: {
		players: number
	}
}

interface PaginationMeta {
	total: number
	page: number
	limit: number
	totalPages: number
}

interface PaginatedMesaResponse {
	data: MesaResponse[]
	meta: PaginationMeta
}

export type {
	MesaResponse,
	PaginationMeta,
	PaginatedMesaResponse
}
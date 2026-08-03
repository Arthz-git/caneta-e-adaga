
interface MesaResponse {
	id: number
	title: string
	description: string
	createdAt: Date
	updatedAt: Date
	isPrivate: boolean
	allowSpectators: boolean
	maxPlayers: number
	imageUrl: string | null
	creator: {
		id: number
		name: string
	}
	countSpectators: number
	countPlayers: number
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
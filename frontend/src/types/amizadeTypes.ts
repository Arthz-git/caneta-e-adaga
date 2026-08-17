
interface CreateAmizadeParams {
	amigoId: number
}

interface AmizadeResponse {
	id: number
	createdAt: Date
	updatedAt: Date
	userA: {
		id: number
		name: string
	}
	userB: {
		id: number
		name: string
	}
}

interface PaginationMeta {
	total: number
	page: number
	limit: number
	totalPages: number
}

interface PaginatedAmizadeResponse {
	data: AmizadeResponse[]
	meta: PaginationMeta
}

interface GetAllAmizadeParams {
	page?: number
	limit?: number
}

export type {
	CreateAmizadeParams,
	AmizadeResponse,
	PaginatedAmizadeResponse,
	GetAllAmizadeParams
}

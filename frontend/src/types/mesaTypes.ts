
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
	isMember: boolean
	lastPostAt: Date | null
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

interface CreateMesaParams {
	title: string
	description: string
	isPrivate: boolean
	allowSpectators: boolean
	maxPlayers: number
	image?: File
}

interface UpdateMesaParams {
	id: number
	title: string
	description: string
	isPrivate: boolean
	allowSpectators: boolean
	maxPlayers: number
	image?: File
}

interface GetAllMesaPaginatedParams {
	page?: number
	limit?: number
	search?: string
	mine?: boolean
}

interface GetMesaInfoResponse {
	id: number
	title: string
	description: string
	createdBy: number
	createdAt: Date
	updatedAt: Date
	isPrivate: boolean
	allowSpectators: boolean
	maxPlayers: number
	imageUrl: string | null
	creator: {
		name: string
	}
	players: {
		id: number
		userId: number
		user: {
			name: string
		}
		mesaId: number
		role: "MASTER" | "PLAYER" | "SPECTATOR"
		userCharacterId: number | null
		userCharacter: {
			name: string | null
			imageUrl: string | null
		}
		joinedAt: Date
		updatedAt: Date
		isFavorite: boolean
	}[]
}

export type {
	MesaResponse,
	PaginationMeta,
	PaginatedMesaResponse,
	CreateMesaParams,
	UpdateMesaParams,
	GetAllMesaPaginatedParams,
	GetMesaInfoResponse
}
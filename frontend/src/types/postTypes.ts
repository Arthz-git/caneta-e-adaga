export type PostType = 'CHARACTER' | 'NARRATOR' | 'NPC' | 'SYSTEM' | 'OOC'

export const POST_TYPE_LABELS: Record<PostType, string> = {
	NARRATOR: 'Narrador',
	CHARACTER: 'Personagem',
	NPC: 'NPC',
	SYSTEM: 'Sistema',
	OOC: 'OOC (fora do personagem)'
}

interface PostAuthor {
	id: number
	name: string
}

interface PostCharacter {
	id: number
	name: string
	imageUrl: string | null
}

interface PostListItem {
	id: number
	mesaId: number
	userId: number
	text: string
	type: PostType
	characterId: number | null
	npcName: string | null
	createdAt: Date
	updatedAt: Date
	author: PostAuthor
	character: PostCharacter | null
	visiblePlayerIds: number[]
}

interface PostsPaginationMeta {
	total: number
	page: number
	limit: number
	totalPages: number
}

interface PaginatedPostsResponse {
	data: PostListItem[]
	meta: PostsPaginationMeta
}

export type {
	PostAuthor,
	PostCharacter,
	PostListItem,
	PostsPaginationMeta,
	PaginatedPostsResponse
}

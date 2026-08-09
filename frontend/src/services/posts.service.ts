import type { PaginatedPostsResponse, PostType } from '@/types/postTypes'
import api from './api'

export type CreatePostParams = {
	mesaId: number
	text: string
	type: PostType
	characterId?: number | null
	npcName?: string | null
	visiblePlayerIds?: number[]
}

export type PostResponse = {
	id: number
	mesaId: number
	userId: number
	text: string
	type: PostType
	characterId: number | null
	npcName: string | null
	createdAt: string
}

export type GetPaginatedPostsParams = {
	page?: number
	limit?: number
}

async function createPost(params: CreatePostParams) {
	const post = await api.post<PostResponse>('/posts', params)

	return post.data
}

async function getPaginatedPosts(mesaId: number, params: GetPaginatedPostsParams = {}) {
	const posts = await api.get<PaginatedPostsResponse>(`/posts/mesaId/${mesaId}/paginated`, { params })

	return posts.data
}

async function getLastPostId(mesaId: number) {
	const { meta } = await getPaginatedPosts(mesaId, { page: 1, limit: 1 })
	if (meta.total === 0) return null

	const { data } = await getPaginatedPosts(mesaId, { page: meta.total, limit: 1 })

	return data[0]?.id ?? null
}

export {
	createPost,
	getPaginatedPosts,
	getLastPostId
}

import type { PostModel } from '../../../generated/prisma/models'
import type { CreatePostDTO } from '../schemas/createPost.schema'
import type { PostResponseRepository } from '../schemas/postResponse.schema'

export interface GetAllPaginatedParams {
	page: number
	limit: number
}

export interface GetAllPaginatedResult {
	data: PostResponseRepository[]
	total: number
}

export interface PostsViewer {
	playerId: number
	isMaster: boolean
}

export interface IPostsRepository {
	create(data: CreatePostDTO): Promise<PostModel>
	getAllByMesaId(mesaId: number, viewer: PostsViewer): Promise<PostResponseRepository[]>
	getPaginatedByMesaId(mesaId: number, params: GetAllPaginatedParams, viewer: PostsViewer): Promise<GetAllPaginatedResult>
}

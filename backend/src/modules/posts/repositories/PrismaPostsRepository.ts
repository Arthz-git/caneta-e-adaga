import { prisma } from '../../../database/prisma-client'
import type { CreatePostDTO } from '../schemas/createPost.schema'
import type { GetAllPaginatedParams, IPostsRepository, PostsViewer } from './IPostsRepository'

const includeRelations = {
	author: {
		select: { id: true, name: true }
	},
	character: {
		select: { id: true, name: true, imageUrl: true }
	},
	visiblePlayers: {
		select: { playerId: true }
	}
}

function mapPost<T extends { visiblePlayers: { playerId: number }[] }>({ visiblePlayers, ...post }: T) {
	return { ...post, visiblePlayerIds: visiblePlayers.map(visiblePlayer => visiblePlayer.playerId) }
}

function buildVisibilityWhere(mesaId: number, { playerId, isMaster }: PostsViewer) {
	if (isMaster) return { mesaId }

	return {
		mesaId,
		OR: [
			{ visiblePlayers: { none: {} } },
			{ visiblePlayers: { some: { playerId } } }
		]
	}
}

export class PrismaPostsRepository implements IPostsRepository {
	async create(data: CreatePostDTO) {
		const { visiblePlayerIds, ...postData } = data

		return prisma.post.create({
			data: {
				...postData,
				visiblePlayers: visiblePlayerIds
					? { create: visiblePlayerIds.map(playerId => ({ playerId })) }
					: undefined
			}
		})
	}

	async getAllByMesaId(mesaId: number, viewer: PostsViewer) {
		const posts = await prisma.post.findMany({
			where: buildVisibilityWhere(mesaId, viewer),
			include: includeRelations,
			orderBy: { createdAt: 'asc' }
		})

		return posts.map(mapPost)
	}

	async getPaginatedByMesaId(mesaId: number, { page, limit }: GetAllPaginatedParams, viewer: PostsViewer) {
		const where = buildVisibilityWhere(mesaId, viewer)

		const [posts, total] = await prisma.$transaction([
			prisma.post.findMany({
				where,
				include: includeRelations,
				orderBy: { createdAt: 'asc' },
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.post.count({ where })
		])

		return { data: posts.map(mapPost), total }
	}
}

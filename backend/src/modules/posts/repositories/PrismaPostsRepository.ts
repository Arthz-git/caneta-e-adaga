import { prisma } from '../../../database/prisma-client'
import type { CreatePostDTO } from '../schemas/createPost.schema'
import type { GetAllPaginatedParams, IPostsRepository } from './IPostsRepository'

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

	async getAllByMesaId(mesaId: number) {
		const posts = await prisma.post.findMany({
			where: { mesaId },
			include: includeRelations,
			orderBy: { createdAt: 'asc' }
		})

		return posts.map(mapPost)
	}

	async getPaginatedByMesaId(mesaId: number, { page, limit }: GetAllPaginatedParams) {
		const where = { mesaId }

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

	async getLastByMesaId(mesaId: number) {
		return prisma.post.findFirst({
			where: { mesaId },
			orderBy: { createdAt: 'desc' }
		})
	}
}

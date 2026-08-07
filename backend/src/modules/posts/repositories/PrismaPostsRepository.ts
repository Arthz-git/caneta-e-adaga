import { prisma } from '../../../database/prisma-client'
import type { CreatePostDTO } from '../schemas/createPost.schema'
import type { GetAllPaginatedParams, IPostsRepository } from './IPostsRepository'

const includeRelations = {
	author: {
		select: { id: true, name: true }
	},
	character: {
		select: { id: true, name: true, imageUrl: true }
	}
}

export class PrismaPostsRepository implements IPostsRepository {
	async create(data: CreatePostDTO) {
		return prisma.post.create({ data })
	}

	async getAllByMesaId(mesaId: number) {
		return prisma.post.findMany({
			where: { mesaId },
			include: includeRelations,
			orderBy: { createdAt: 'asc' }
		})
	}

	async getPaginatedByMesaId(mesaId: number, { page, limit }: GetAllPaginatedParams) {
		const where = { mesaId }

		const [data, total] = await prisma.$transaction([
			prisma.post.findMany({
				where,
				include: includeRelations,
				orderBy: { createdAt: 'asc' },
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.post.count({ where })
		])

		return { data, total }
	}
}

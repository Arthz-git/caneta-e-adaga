import { prisma } from '../../../database/prisma-client'
import type { GetAllPaginatedParams, IAmizadesRepository } from './IAmizadesRepository'

const includeRelations = {
	userA: {
		select: { id: true, name: true }
	},
	userB: {
		select: { id: true, name: true }
	}
}

function normalizeUserIds(userAId: number, userBId: number) {
	return userAId < userBId
		? { userAId, userBId }
		: { userAId: userBId, userBId: userAId }
}

export class PrismaAmizadesRepository implements IAmizadesRepository {
	async create(userAId: number, userBId: number) {
		const { userAId: normalizedA, userBId: normalizedB } = normalizeUserIds(userAId, userBId)

		return prisma.amizade.create({
			data: {
				userAId: normalizedA,
				userBId: normalizedB
			}
		})
	}

	async get(id: number) {
		return prisma.amizade.findUnique({
			where: { id },
			include: includeRelations
		})
	}

	async findByUsers(userAId: number, userBId: number) {
		const { userAId: normalizedA, userBId: normalizedB } = normalizeUserIds(userAId, userBId)

		return prisma.amizade.findUnique({
			where: { userAId_userBId: { userAId: normalizedA, userBId: normalizedB } },
			include: includeRelations
		})
	}

	async delete(id: number) {
		await prisma.amizade.delete({ where: { id } })
	}

	async getAllPaginated(userId: number, { page, limit }: GetAllPaginatedParams) {
		const where = { OR: [{ userAId: userId }, { userBId: userId }] }

		const [data, total] = await prisma.$transaction([
			prisma.amizade.findMany({
				where,
				include: includeRelations,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.amizade.count({ where })
		])

		return { data, total }
	}
}

import { prisma } from '../../../database/prisma-client'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'
import type { UpdateMesaDTO } from '../schemas/updateMesa.schema'
import type { GetAllPaginatedParams, IMesasRepository } from './IMesasRepository'

const includeRelationsList = {
	creator: {
		select: { name: true }
	},
	posts: {
		select: { createdAt: true },
		orderBy: { createdAt: 'desc' as const },
		take: 1
	},
	players: {
		select: {
			id: true,
			userId: true,
			mesaId: true,
			role: true,
			userCharacterId: true,
			joinedAt: true,
			updatedAt: true,
			isFavorite: true
		},
		orderBy: { joinedAt: 'asc' as const }
	}
}

const includeRelationsDetail = {
	creator: {
		select: { name: true }
	},
	players: {
		select: {
			id: true,
			userId: true,
			user: {
				select: { name: true }
			},
			mesaId: true,
			role: true,
			userCharacterId: true,
			userCharacter: {
				select: { name: true, imageUrl: true }
			},
			joinedAt: true,
			updatedAt: true,
			isFavorite: true
		},
		orderBy: { joinedAt: 'asc' as const }
	}
}

export class PrismaMesasRepository implements IMesasRepository {
	async create(data: CreateMesaDTO) {
		return prisma.mesa.create({ data })
	}

	async update({ id, ...data }: UpdateMesaDTO) {
		return prisma.mesa.update({
			where: { id },
			data: data
		})
	}

	async delete(id: number) {
		await prisma.mesa.delete({ where: { id } })
	}

	async get(id: number) {
		return prisma.mesa.findUnique({
			where: { id },
			include: includeRelationsDetail
		})
	}

	async getAllByCreator(createdBy: number) {
		return prisma.mesa.findMany({
			where: { createdBy },
			include: includeRelationsList
		})
	}

	async getAll() {
		return prisma.mesa.findMany({
			include: includeRelationsList
		})
	}

	async getAllPaginated({ page, limit, search, mine, userId }: GetAllPaginatedParams) {
		const searchFilter = search
			? {
				OR: [
					{ title: { contains: search } },
					{ description: { contains: search } }
				]
			}
			: {}

		const mineFilter = mine && userId
			? {
				OR: [
					{ createdBy: userId },
					{ players: { some: { userId } } }
				]
			}
			: {}

		const where = { AND: [searchFilter, mineFilter] }

		const [data, total] = await prisma.$transaction([
			prisma.mesa.findMany({
				where,
				include: includeRelationsList,
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.mesa.count({ where })
		])

		return { data, total }
	}
}
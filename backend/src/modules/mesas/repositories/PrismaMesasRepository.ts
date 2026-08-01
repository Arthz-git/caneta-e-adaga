import { prisma } from '../../../database/prisma-client'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'
import type { UpdateMesaDTO } from '../schemas/updateMesa.schema'
import type { GetAllPaginatedParams, IMesasRepository } from './IMesasRepository'

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
			include: {
				creator: {
					select: { name: true }
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
					}
				}
			}
		})
	}

	async getAllByCreator(createdBy: number) {
		return prisma.mesa
			.findMany({
				where: { createdBy },
				include: {
					creator: {
						select: { name: true }
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
						}
					}
				}
			})
	}

	async getAll() {
		return prisma.mesa
			.findMany({
				include: {
					creator: {
						select: { name: true }
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
						}
					}
				}
			})
	}

	async getAllPaginated({ page, limit, search }: GetAllPaginatedParams) {
		const where = search
			? {
				OR: [
					{ title: { contains: search } },
					{ description: { contains: search } }
				]
			}
			: {}

		const [data, total] = await prisma.$transaction([
			prisma.mesa.findMany({
				where,
				include: {
					creator: {
						select: { name: true }
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
						}
					}
				},
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.mesa.count({ where })
		])

		return { data, total }
	}
}
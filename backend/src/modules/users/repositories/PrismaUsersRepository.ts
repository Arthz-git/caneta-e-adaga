import { prisma } from '../../../database/prisma-client'
import type { CreateUserDTO } from '../schemas/createUser.schema'
import type { IUsersRepository } from './IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {
	async create(data: CreateUserDTO) {
		return prisma.user.create({ data })
	}

	async getByEmail(email: string) {
		return prisma.user.findUnique({ where: { email } })
	}

	async get(id: number) {
		return prisma.user.findUnique({ where: { id } })
	}

	async searchByName(name: string) {
		return prisma.user.findMany({
			where: { name: { contains: name, mode: 'insensitive' } },
			select: { id: true, name: true },
			orderBy: { name: 'asc' },
			take: 10
		})
	}
}

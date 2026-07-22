import { prisma } from '../../../database/prisma-client'
import type { CreateUserDTO } from '../schemas/createUser.schema'
import type { IUsersRepository } from './IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {
	async create(data: CreateUserDTO) {
		return prisma.user.create({ data })
	}

	async findByEmail(email: string) {
		return prisma.user.findUnique({ where: { email } })
	}

	async findById(id: number) {
		return prisma.user.findUnique({ where: { id } })
	}
}

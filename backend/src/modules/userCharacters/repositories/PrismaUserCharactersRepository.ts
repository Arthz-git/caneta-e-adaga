import { prisma } from '../../../database/prisma-client'
import { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import { UpdateUserCharacterDTO } from '../schemas/updateUserCharacter.schema'
import { IUserCharactersRepository } from './IUserCharactersRepository'

export class PrismaUserCharactersRepository implements IUserCharactersRepository {
	async create(data: CreateUserCharacterDTO) {
		return prisma.userCharacter.create({ data })
	}

	async update(data: UpdateUserCharacterDTO) {
		return prisma.userCharacter.update({
			where: { id: data.id },
			data: {
				name: data.name,
				description: data.description,
				lore: data.lore
			}
		})
	}

	async delete(id: number) {
		await prisma.userCharacter.delete({ where: { id } })
	}

	async find(id: number) {
		return prisma.userCharacter.findUnique({ where: { id } })
	}

	async findAllByUserId(userId: number) {
		return prisma.userCharacter.findMany({ where: { userId } })
	}
}
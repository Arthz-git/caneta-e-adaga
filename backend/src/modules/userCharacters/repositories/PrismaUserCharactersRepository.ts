import { prisma } from '../../../database/prisma-client'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import type { UpdateUserCharacterDTO } from '../schemas/updateUserCharacter.schema'
import type { IUserCharactersRepository } from './IUserCharactersRepository'

export class PrismaUserCharactersRepository implements IUserCharactersRepository {
	async create(data: CreateUserCharacterDTO) {
		return prisma.userCharacter.create({ data })
	}

	async update({ id, ...data }: UpdateUserCharacterDTO) {
		return prisma.userCharacter.update({
			where: { id: id },
			data: data
		})
	}

	async delete(id: number) {
		await prisma.userCharacter.delete({ where: { id } })
	}

	async get(id: number) {
		return prisma.userCharacter.findUnique({ where: { id } })
	}

	async getAllByUserId(userId: number) {
		const characters = await prisma.userCharacter.findMany({
			where: { userId },
			include: { players: { select: { mesaId: true, mesa: { select: { title: true } } } } }
		})

		return characters.map(({ players, ...character }) => ({
			...character,
			linkedMesaId: players[0]?.mesaId ?? null,
			linkedMesaTitle: players[0]?.mesa.title ?? null
		}))
	}
}
import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../database/prisma-client'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import type { UpdateUserCharacterDTO } from '../schemas/updateUserCharacter.schema'
import type { IUserCharactersRepository } from './IUserCharactersRepository'

export class PrismaUserCharactersRepository implements IUserCharactersRepository {
	async create({ sheet, ...data }: CreateUserCharacterDTO) {
		return prisma.userCharacter.create({
			data: { ...data, sheet: sheet as Prisma.InputJsonValue | undefined }
		})
	}

	async update({ id, sheet, ...data }: UpdateUserCharacterDTO) {
		return prisma.userCharacter.update({
			where: { id: id },
			data: { ...data, sheet: sheet as Prisma.InputJsonValue | undefined }
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
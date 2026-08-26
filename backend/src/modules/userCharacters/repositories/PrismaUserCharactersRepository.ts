import type { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../database/prisma-client'
import type { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import type { UpdateUserCharacterDTO } from '../schemas/updateUserCharacter.schema'
import type { CreateSheetHistoryDTO, IUserCharactersRepository } from './IUserCharactersRepository'

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

	async addSheetHistory({ userCharacterId, changedById, previousSheet, newSheet }: CreateSheetHistoryDTO) {
		await prisma.userCharacterSheetHistory.create({
			data: {
				userCharacterId,
				changedById,
				previousSheet: previousSheet as Prisma.InputJsonValue | undefined,
				newSheet: newSheet as Prisma.InputJsonValue | undefined
			}
		})
	}

	async getSheetHistory(userCharacterId: number) {
		return prisma.userCharacterSheetHistory.findMany({
			where: { userCharacterId },
			orderBy: { createdAt: 'desc' }
		})
	}
}
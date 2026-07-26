import { prisma } from '../../../database/prisma-client'
import type { CreatePlayerDTO } from '../schemas/createPlayer.schema'
import { UpdateCharacterPlayerDTO } from '../schemas/updateCharacterPlayer.schema'
import { UpdateRolePlayerDTO } from '../schemas/updateRolePlayer.schema'
import type { IPlayersRepository } from './IPlayersRepository'

export class PrismaPlayersRepository implements IPlayersRepository {
	async create(data: CreatePlayerDTO) {
		return prisma.players.create({ data })
	}

	async delete(id: number) {
		await prisma.players.delete({ where: { id } })
	}

	async get(id: number) {
		return prisma.players.findUnique({ where: { id } })
	}

	async getByUserAndMesa(userId: number, mesaId: number) {
		return prisma.players.findUnique({
			where: { userId_mesaId: { userId, mesaId } }
		})
	}

	async updateRole({ id, ...data }: UpdateRolePlayerDTO) {
		return prisma.players.update({
			where: { id },
			data: data
		})
	}

	async updateCharacter({ id, ...data }: UpdateCharacterPlayerDTO) {
		return prisma.players.update({
			where: { id },
			data: data
		})
	}

	async getPlayersByMesaId(mesaId: number) {
		return prisma.players.findMany({ where: { mesaId } })
	}
}
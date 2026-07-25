import { prisma } from '../../../database/prisma-client'
import type { CreateMesaPlayerDTO } from '../schemas/createMesaPlayer.schema'
import { UpdateCharacterMesaPlayerDTO } from '../schemas/updateCharacterMesaPlayer.schema'
import { UpdateRoleMesaPlayerDTO } from '../schemas/updateRoleMesaPlayer.schema'
import type { IMesaPlayersRepository } from './IMesaPlayersRepository'

export class PrismaMesaPlayersRepository implements IMesaPlayersRepository {
	async create(data: CreateMesaPlayerDTO) {
		return prisma.mesaPlayers.create({ data })
	}

	async delete(id: number) {
		await prisma.mesaPlayers.delete({ where: { id } })
	}

	async get(id: number) {
		return prisma.mesaPlayers.findUnique({ where: { id } })
	}

	async getByUserAndMesa(userId: number, mesaId: number) {
		return prisma.mesaPlayers.findUnique({
			where: { userId_mesaId: { userId, mesaId } }
		})
	}

	async updateRole({ id, ...data }: UpdateRoleMesaPlayerDTO) {
		return prisma.mesaPlayers.update({
			where: { id },
			data: data
		})
	}

	async updateCharacter({ id, ...data }: UpdateCharacterMesaPlayerDTO) {
		return prisma.mesaPlayers.update({
			where: { id },
			data: data
		})
	}
}
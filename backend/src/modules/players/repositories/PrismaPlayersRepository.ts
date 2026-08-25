import { prisma } from '../../../database/prisma-client'
import { PlayersModel } from '../../../generated/prisma/models'
import { AppError } from '../../../shared/errors/AppError'
import type { CreatePlayerDTO } from '../schemas/createPlayer.schema'
import { UpdateCharacterPlayerDTO } from '../schemas/updateCharacterPlayer.schema'
import { UpdateFavoritePlayerDTO } from '../schemas/updateFavoritePlayer.schema'
import { UpdateRolePlayerDTO } from '../schemas/updateRolePlayer.schema'
import type { IPlayersRepository } from './IPlayersRepository'

export class PrismaPlayersRepository implements IPlayersRepository {
	async create(data: CreatePlayerDTO) {
		return prisma.players.create({ data })
	}

	async createWithCapacityCheck(data: CreatePlayerDTO, maxPlayers: number) {
		return prisma.$transaction(async tx => {
			// trava a linha da mesa até o fim da transação, serializando criações concorrentes
			await tx.$queryRaw`SELECT id FROM mesas WHERE id = ${data.mesaId} FOR UPDATE`

			const countPlayers = await tx.players.count({
				where: { mesaId: data.mesaId, role: { not: 'SPECTATOR' } }
			})

			if (countPlayers >= maxPlayers) {
				throw new AppError('Esta mesa está lotada', 403)
			}

			if (data.role === 'MASTER') {
				const existingMaster = await tx.players.findFirst({
					where: { mesaId: data.mesaId, role: 'MASTER' }
				})

				if (existingMaster) {
					throw new AppError('Esta mesa já possui um mestre', 403)
				}
			}

			return tx.players.create({ data })
		})
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

	async getByUserCharacterId(userCharacterId: number) {
		return prisma.players.findUnique({ where: { userCharacterId } })
	}

	async updateRole({ id, ...data }: UpdateRolePlayerDTO) {
		return prisma.players.update({
			where: { id },
			data: data
		})
	}

	async updateRoleWithMasterCheck({ id, ...data }: UpdateRolePlayerDTO, mesaId: number, maxPlayers: number) {
		return prisma.$transaction(async tx => {
			// trava a linha da mesa até o fim da transação, serializando trocas de role concorrentes
			await tx.$queryRaw`SELECT id FROM mesas WHERE id = ${mesaId} FOR UPDATE`

			if (data.role === 'MASTER') {
				const existingMaster = await tx.players.findFirst({
					where: { mesaId, role: 'MASTER', id: { not: id } }
				})

				if (existingMaster) {
					throw new AppError('Esta mesa já possui um mestre', 403)
				}
			}

			if (data.role !== 'SPECTATOR') {
				const countOtherOccupiedSlots = await tx.players.count({
					where: { mesaId, role: { not: 'SPECTATOR' }, id: { not: id } }
				})

				if (countOtherOccupiedSlots >= maxPlayers) {
					throw new AppError('Esta mesa está lotada', 403)
				}
			}

			return tx.players.update({
				where: { id },
				data: data
			})
		})
	}

	async updateCharacter({ id, ...data }: UpdateCharacterPlayerDTO) {
		return prisma.players.update({
			where: { id },
			data: data
		})
	}

	async getPlayersByMesaId(mesaId: number) {
		return prisma.players.findMany({ where: { mesaId }, orderBy: { joinedAt: 'asc' } })
	}

	async updateFavorite({ id, ...data }: UpdateFavoritePlayerDTO) {
		return prisma.players.update({
			where: { id },
			data: data
		})
	}
}
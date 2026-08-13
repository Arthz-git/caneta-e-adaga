import { prisma } from '../../../database/prisma-client'
import type { CreateNotificacaoDTO } from '../schemas/createNotificacao.schema'
import type { GetAllPaginatedParams, INotificacoesRepository } from './INotificacoesRepository'

const includeRelations = {
	destino: {
		select: { id: true, name: true }
	},
	remetente: {
		select: { id: true, name: true }
	},
	solicitacao: {
		select: { id: true, motivo: true }
	},
	mesa: {
		select: { id: true, title: true }
	},
	post: {
		select: { id: true }
	}
}

export class PrismaNotificacoesRepository implements INotificacoesRepository {
	async create(data: CreateNotificacaoDTO) {
		return prisma.notificacao.create({
			data: {
				destinoId: data.destinoId,
				remetenteId: data.remetenteId,
				tipo: data.tipo,
				message: data.message,
				solicitacaoId: data.solicitacaoId,
				mesaId: data.mesaId,
				postId: data.postId
			}
		})
	}

	async get(id: number) {
		return prisma.notificacao.findUnique({
			where: { id },
			include: includeRelations
		})
	}

	async getAllByDestinoPaginated(destinoId: number, { page, limit, apenasNaoLidas }: GetAllPaginatedParams) {
		const where = { destinoId, ...(apenasNaoLidas ? { readAt: null } : {}) }

		const [data, total] = await prisma.$transaction([
			prisma.notificacao.findMany({
				where,
				include: includeRelations,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.notificacao.count({ where })
		])

		return { data, total }
	}

	async countNaoLidas(destinoId: number) {
		return prisma.notificacao.count({ where: { destinoId, readAt: null } })
	}

	async markAsRead(id: number) {
		return prisma.notificacao.update({
			where: { id },
			data: { readAt: new Date() }
		})
	}

	async markAllAsRead(destinoId: number) {
		await prisma.notificacao.updateMany({
			where: { destinoId, readAt: null },
			data: { readAt: new Date() }
		})
	}

	async delete(id: number) {
		await prisma.notificacao.delete({ where: { id } })
	}
}

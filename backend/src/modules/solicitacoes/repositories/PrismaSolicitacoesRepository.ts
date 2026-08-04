import { prisma } from '../../../database/prisma-client'
import type { CreateSolicitacaoDTO } from '../schemas/createSolicitacao.schema'
import type { GetAllPaginatedParams, ISolicitacoesRepository } from './ISolicitacoesRepository'

const includeRelations = {
	solicitante: {
		select: { id: true, name: true }
	},
	destino: {
		select: { id: true, name: true }
	},
	mesa: {
		select: { id: true, title: true }
	}
}

export class PrismaSolicitacoesRepository implements ISolicitacoesRepository {
	async create(data: CreateSolicitacaoDTO) {
		return prisma.solicitacao.create({
			data: {
				motivo: data.motivo,
				solicitanteId: data.solicitanteId,
				destinoId: data.destinoId,
				mesaId: data.mesaId
			}
		})
	}

	async get(id: number) {
		return prisma.solicitacao.findUnique({
			where: { id },
			include: includeRelations
		})
	}

	async updateStatus(id: number, status: 'ACEITA' | 'RECUSADA' | 'CANCELADA', respostaSolicitacao?: string) {
		return prisma.solicitacao.update({
			where: { id },
			data: { status, respostaSolicitacao }
		})
	}

	async delete(id: number) {
		await prisma.solicitacao.delete({ where: { id } })
	}

	async getAllRecebidasPaginated(destinoId: number, { page, limit, status, motivo }: GetAllPaginatedParams) {
		const where = { destinoId, ...(status ? { status } : {}), ...(motivo ? { motivo } : {}) }

		const [data, total] = await prisma.$transaction([
			prisma.solicitacao.findMany({
				where,
				include: includeRelations,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.solicitacao.count({ where })
		])

		return { data, total }
	}

	async getAllEnviadasPaginated(solicitanteId: number, { page, limit, status, motivo }: GetAllPaginatedParams) {
		const where = { solicitanteId, ...(status ? { status } : {}), ...(motivo ? { motivo } : {}) }

		const [data, total] = await prisma.$transaction([
			prisma.solicitacao.findMany({
				where,
				include: includeRelations,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.solicitacao.count({ where })
		])

		return { data, total }
	}
}

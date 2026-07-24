import { prisma } from '../../../database/prisma-client'
import type { CreateMesaDTO } from '../schemas/createMesa.schema'
import type { UpdateMesaDTO } from '../schemas/updateMesa.schema'
import type { IMesasRepository } from './IMesasRepository'

export class PrismaMesasRepository implements IMesasRepository {
	async create(data: CreateMesaDTO) {
		return prisma.mesa.create({ data })
	}

	async update({ id, ...data }: UpdateMesaDTO) {
		return prisma.mesa.update({
			where: { id: id },
			data: data
		})
	}

	async delete(id: number) {
		await prisma.mesa.delete({ where: { id } })
	}

	async get(id: number) {
		return prisma.mesa.findUnique({ where: { id } })
	}

	async getAllByCreator(createdBy: number) {
		return prisma.mesa.findMany({ where: { createdBy } })
	}
}
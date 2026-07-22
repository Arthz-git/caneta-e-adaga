import { prisma } from '../../../database/prisma-client'
import { CreateUserCharacterDTO } from '../schemas/createUserCharacter.schema'
import { IUserCharactersRepository } from './IUserCharactersRepository'

export class PrismaUserCharactersRepository implements IUserCharactersRepository {
	async create(data: CreateUserCharacterDTO) {
		return prisma.userCharacter.create({ data })
	}
}
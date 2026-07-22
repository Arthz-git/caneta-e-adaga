import type { UserModel } from '../../../generated/prisma/models/User'
import type { CreateUserDTO } from '../schemas/createUser.schema'

export interface IUsersRepository {
	create(data: CreateUserDTO): Promise<UserModel>
	findByEmail(email: string): Promise<UserModel | null>
	findById(id: number): Promise<UserModel | null>
}

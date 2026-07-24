import type { UserModel } from '../../../generated/prisma/models/User'
import type { CreateUserDTO } from '../schemas/createUser.schema'

export interface IUsersRepository {
	create(data: CreateUserDTO): Promise<UserModel>
	getByEmail(email: string): Promise<UserModel | null>
	get(id: number): Promise<UserModel | null>
}

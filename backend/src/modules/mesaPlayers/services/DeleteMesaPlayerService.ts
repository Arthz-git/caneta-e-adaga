import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IUserCharactersRepository } from '../../userCharacters/repositories/IUserCharactersRepository'
import type { IUsersRepository } from '../../users/repositories/IUsersRepository'
import type { IMesaPlayersRepository } from '../repositories/IMesaPlayersRepository'
import type { DeleteMesaPlayerDTO } from '../schemas/deleteMesaPlayer.schema'

export class DeleteMesaPlayerService {
	constructor(private mesaPlayersRepository: IMesaPlayersRepository) { }

	async execute(data: DeleteMesaPlayerDTO, userId: number) {
		await this.mesaPlayersRepository.delete(data.id)
	}
}
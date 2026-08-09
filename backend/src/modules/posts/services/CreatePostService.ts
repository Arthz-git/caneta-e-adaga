import { AppError } from '../../../shared/errors/AppError'
import type { IMesasRepository } from '../../mesas/repositories/IMesasRepository'
import type { IPlayersRepository } from '../../players/repositories/IPlayersRepository'
import type { IUserCharactersRepository } from '../../userCharacters/repositories/IUserCharactersRepository'
import type { IPostsRepository } from '../repositories/IPostsRepository'
import type { CreatePostDTO } from '../schemas/createPost.schema'

export class CreatePostService {
	constructor(
		private postsRepository: IPostsRepository,
		private mesasRepository: IMesasRepository,
		private playersRepository: IPlayersRepository,
		private userCharactersRepository: IUserCharactersRepository
	) { }

	async execute(data: CreatePostDTO) {
		const mesa = await this.mesasRepository.get(data.mesaId)
		if (!mesa) {
			throw new AppError('Mesa não encontrada', 404)
		}

		// verifica se o usuário que está fazendo a requisição pertence à mesa
		const player = await this.playersRepository.getByUserAndMesa(data.userId, data.mesaId)
		if (!player) {
			throw new AppError('Você não tem permissão para postar nessa mesa', 403)
		}

		if (player.role === 'SPECTATOR') {
			throw new AppError('Espectadores não podem enviar mensagens nessa mesa', 403)
		}

		if (player.role === 'PLAYER' && data.type !== 'OOC' && data.type !== 'CHARACTER') {
			throw new AppError('Jogadores só podem enviar mensagens como Personagem ou OOC', 403)
		}

		if (data.type === 'CHARACTER') {
			if (!data.characterId) {
				throw new AppError('Personagem é obrigatório para posts do tipo CHARACTER', 400)
			}

			const character = await this.userCharactersRepository.get(data.characterId)
			if (!character) {
				throw new AppError('Personagem não encontrado', 404)
			}

			if (character.userId !== data.userId) {
				throw new AppError('Personagem não pertence ao usuário', 403)
			}
		}

		if (data.type === 'NPC' && !data.npcName) {
			throw new AppError('Nome do NPC é obrigatório para posts do tipo NPC', 400)
		}

		if (!data.visiblePlayerIds) {
			return this.postsRepository.create(data)
		}

		const mesaPlayers = await this.playersRepository.getPlayersByMesaId(data.mesaId)
		const mesaPlayerIds = new Set(mesaPlayers.map(mesaPlayer => mesaPlayer.id))

		const invalidPlayerId = data.visiblePlayerIds.find(playerId => !mesaPlayerIds.has(playerId))
		if (invalidPlayerId !== undefined) {
			throw new AppError('Um ou mais jogadores selecionados não pertencem a essa mesa', 400)
		}

		const visiblePlayerIds = new Set(data.visiblePlayerIds)
		if (player.role !== 'MASTER') {
			visiblePlayerIds.add(player.id)
		}

		return this.postsRepository.create({ ...data, visiblePlayerIds: [...visiblePlayerIds] })
	}
}

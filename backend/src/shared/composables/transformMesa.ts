import type { MesaResponseDTO, MesaResponseRepository } from '../../modules/mesas/schemas/mesaResponse.schema'

export function TransformMesa(mesas: MesaResponseRepository[]): MesaResponseDTO[] {
	return mesas.map(item => {
		return {
			id: item.id,
			title: item.title,
			description: item.description,
			creator: {
				id: item.createdBy,
				name: item.creator.name
			},
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			isPrivate: item.isPrivate,
			allowSpectators: item.allowSpectators,
			maxPlayers: item.maxPlayers,
			countSpectators: item.players.filter(player => player.role === 'SPECTATOR').length,
			countPlayers: item.players.filter(player => player.role !== 'SPECTATOR').length
		}
	})
}
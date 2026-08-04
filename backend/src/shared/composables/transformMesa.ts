import type { MesaResponseDTO, MesaResponseRepository } from '../../modules/mesas/schemas/mesaResponse.schema'

export function TransformMesa(mesas: MesaResponseRepository[], userId?: number): MesaResponseDTO[] {
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
			imageUrl: item.imageUrl,
			countSpectators: item.players.filter(player => player.role === 'SPECTATOR').length,
			countPlayers: item.players.filter(player => player.role !== 'SPECTATOR').length,
			isMember: userId !== undefined && item.players.some(player => player.userId === userId)
		}
	})
}
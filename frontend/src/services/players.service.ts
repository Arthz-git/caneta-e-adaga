
import api from './api'

interface CreatePlayerParams {
	userId: number
	mesaId: number
	role: 'MASTER' | 'PLAYER' | 'SPECTATOR'
	userCharacterId: number | null
}

async function createPlayer(data: CreatePlayerParams) {
	const player = await api.post('/players', data)

	return player.data
}

async function deletePlayer(id: number) {
	await api.delete(`/players/${id}`)
}

export {
	createPlayer,
	deletePlayer
}

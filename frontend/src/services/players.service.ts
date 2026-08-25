
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

async function notifyPlayer(id: number) {
	await api.post(`/players/notify/${id}`)
}

async function updateCharacterPlayer(id: number, userCharacterId: number | null) {
	const player = await api.patch(`/players/character/${id}`, { userCharacterId })

	return player.data
}

export {
	createPlayer,
	deletePlayer,
	notifyPlayer,
	updateCharacterPlayer
}


import api from './api'

async function deletePlayer(id: number) {
	await api.delete(`/players/${id}`)
}

export {
	deletePlayer
}

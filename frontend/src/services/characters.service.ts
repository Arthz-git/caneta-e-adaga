
import api from './api'
import type { CharactersResponse } from '@/types/charactersTypes'

async function getMyCharacters(id: number) {
	const chars = await api.get<CharactersResponse[]>(`/characters/userId/${id}`)

	return chars.data
}

export {
	getMyCharacters
}
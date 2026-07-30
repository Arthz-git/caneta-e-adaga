
import api from './api'
import type { CharactersResponse, CharacterUpdateParams } from '@/types/charactersTypes'

async function getMyCharacters(id: number) {
	const chars = await api.get<CharactersResponse[]>(`/characters/userId/${id}`)

	return chars.data
}

async function updateMyCharacter(updatedCharacter: CharacterUpdateParams) {
	await api.put(`/characters/${updatedCharacter.id}`, {
		name: updatedCharacter.name,
		description: updatedCharacter.description,
		lore: updatedCharacter.lore
	})
}

async function deleteMyCharacter(charId: number) {
	await api.delete(`/characters/${charId}`)
}

export {
	getMyCharacters,
	updateMyCharacter,
	deleteMyCharacter
}
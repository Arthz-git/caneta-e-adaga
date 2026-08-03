
import api from './api'
import type { CharactersResponse, CharacterUpdateParams } from '@/types/charactersTypes'

interface CreateCharacterParams {
	name: string
	description: string
	lore: string
	image?: File
}

async function getMyCharacters(id: number) {
	const chars = await api.get<CharactersResponse[]>(`/characters/userId/${id}`)

	return chars.data
}

async function createMyCharacter(newCharacter: CreateCharacterParams) {
	const { image, ...data } = newCharacter

	const formData = new FormData()
	Object.entries(data).forEach(([key, value]) => formData.append(key, value))
	if (image) formData.append('image', image)

	const char = await api.post<CharactersResponse>('/characters', formData)

	return char.data
}

async function updateMyCharacter(updatedCharacter: CharacterUpdateParams) {
	const { id, image, ...data } = updatedCharacter

	const formData = new FormData()
	Object.entries(data).forEach(([key, value]) => formData.append(key, value))
	if (image) formData.append('image', image)

	await api.put(`/characters/${id}`, formData)
}

async function deleteMyCharacter(charId: number) {
	await api.delete(`/characters/${charId}`)
}

export {
	getMyCharacters,
	createMyCharacter,
	updateMyCharacter,
	deleteMyCharacter
}
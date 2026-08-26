
import api from './api'
import type { CharactersResponse, CharacterUpdateParams } from '@/types/charactersTypes'
import type { GameSystem } from '@/types/mesaTypes'
import type { SheetData } from '@/constants/characterSheetTemplates'

interface CreateCharacterParams {
	name: string
	description: string
	lore: string
	gameSystem: GameSystem
	sheet?: SheetData
	image?: File
}

async function getMyCharacters(id: number) {
	const chars = await api.get<CharactersResponse[]>(`/characters/userId/${id}`)

	return chars.data
}

async function getCharacterById(id: number) {
	const char = await api.get<CharactersResponse>(`/characters/${id}`)

	return char.data
}

async function createMyCharacter(newCharacter: CreateCharacterParams) {
	const { image, sheet, ...data } = newCharacter

	const formData = new FormData()
	Object.entries(data).forEach(([key, value]) => formData.append(key, value))
	if (sheet) formData.append('sheet', JSON.stringify(sheet))
	if (image) formData.append('image', image)

	const char = await api.post<CharactersResponse>('/characters', formData)

	return char.data
}

async function updateMyCharacter(updatedCharacter: CharacterUpdateParams) {
	const { id, image, sheet, ...data } = updatedCharacter

	const formData = new FormData()
	Object.entries(data).forEach(([key, value]) => formData.append(key, value))
	if (sheet) formData.append('sheet', JSON.stringify(sheet))
	if (image) formData.append('image', image)

	await api.put(`/characters/${id}`, formData)
}

async function deleteMyCharacter(charId: number) {
	await api.delete(`/characters/${charId}`)
}

export {
	getMyCharacters,
	getCharacterById,
	createMyCharacter,
	updateMyCharacter,
	deleteMyCharacter
}
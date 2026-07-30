interface CharactersResponse {
	id: number
	userId: number
	name: string
	description: string
	lore: string
	createdAt: Date
	updatedAt: Date
}

interface CharacterUpdateParams {
	id: number
	name: string
	description: string
	lore: string
}

export type {
	CharactersResponse,
	CharacterUpdateParams
}
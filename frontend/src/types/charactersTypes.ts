interface CharactersResponse {
	id: number
	userId: number
	name: string
	description: string
	lore: string
	imageUrl: string | null
	createdAt: Date
	updatedAt: Date
}

interface CharacterUpdateParams {
	id: number
	name: string
	description: string
	lore: string
	image?: File
}

export type {
	CharactersResponse,
	CharacterUpdateParams
}
interface CharactersResponse {
	id: number
	userId: number
	name: string
	description: string
	lore: string
	imageUrl: string | null
	createdAt: Date
	updatedAt: Date
	linkedMesaId?: number | null
	linkedMesaTitle?: string | null
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
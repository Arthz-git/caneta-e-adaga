import type { GameSystem } from '@/types/mesaTypes'
import type { SheetData } from '@/constants/characterSheetTemplates'

interface CharactersResponse {
	id: number
	userId: number
	name: string
	description: string
	lore: string
	imageUrl: string | null
	gameSystem: GameSystem
	sheet: SheetData | null
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
	sheet?: SheetData
	image?: File
}

export type {
	CharactersResponse,
	CharacterUpdateParams
}

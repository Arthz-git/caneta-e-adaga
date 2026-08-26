import type { GameSystem } from '@/types/mesaTypes'

const GAME_SYSTEM_LABELS: Record<GameSystem, string> = {
	DND5E: 'D&D 5e',
	VAMPIRO_A_MASCARA: 'Vampiro: a Máscara',
	LIVRE: 'Livre / Sem sistema'
}

const GAME_SYSTEM_OPTIONS = (Object.keys(GAME_SYSTEM_LABELS) as GameSystem[]).map(value => ({
	label: GAME_SYSTEM_LABELS[value],
	value
}))

export { GAME_SYSTEM_LABELS, GAME_SYSTEM_OPTIONS }

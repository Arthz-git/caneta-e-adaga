import type { GameSystem } from '@/types/mesaTypes'
import type { SheetTemplate } from './types'
import { DND5E_TEMPLATE } from './dnd5e'
import { VAMPIRO_A_MASCARA_TEMPLATE } from './vampiroAMascara'
import { LIVRE_TEMPLATE } from './livre'

const CHARACTER_SHEET_TEMPLATES: Record<GameSystem, SheetTemplate> = {
	DND5E: DND5E_TEMPLATE,
	VAMPIRO_A_MASCARA: VAMPIRO_A_MASCARA_TEMPLATE,
	LIVRE: LIVRE_TEMPLATE
}

export { CHARACTER_SHEET_TEMPLATES }
export type { SheetFieldDef, SheetFieldType, SheetSectionDef, SheetTemplate, SheetData, SheetValue } from './types'

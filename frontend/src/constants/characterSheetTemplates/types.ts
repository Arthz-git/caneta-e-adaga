type SheetFieldType = 'text' | 'number' | 'textarea' | 'dots' | 'modifier'

interface SheetFieldDef {
	key: string
	label: string
	type: SheetFieldType
	min?: number
	max?: number
}

interface SheetSectionDef {
	title: string
	fields: SheetFieldDef[]
}

type SheetTemplate = SheetSectionDef[]

type SheetValue = string | number
type SheetData = Record<string, SheetValue>

export type { SheetFieldDef, SheetFieldType, SheetSectionDef, SheetTemplate, SheetData, SheetValue }

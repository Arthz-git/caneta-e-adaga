import type { SheetTemplate } from './types'

const DND5E_TEMPLATE: SheetTemplate = [
	{
		title: 'Identidade',
		fields: [
			{ key: 'classe', label: 'Classe', type: 'text' },
			{ key: 'nivel', label: 'Nível', type: 'number', min: 1, max: 20 },
			{ key: 'raca', label: 'Raça', type: 'text' },
			{ key: 'antecedente', label: 'Antecedente', type: 'text' },
			{ key: 'alinhamento', label: 'Alinhamento', type: 'text' }
		]
	},
	{
		title: 'Atributos',
		fields: [
			{ key: 'forca', label: 'Força', type: 'modifier', min: 1, max: 30 },
			{ key: 'destreza', label: 'Destreza', type: 'modifier', min: 1, max: 30 },
			{ key: 'constituicao', label: 'Constituição', type: 'modifier', min: 1, max: 30 },
			{ key: 'inteligencia', label: 'Inteligência', type: 'modifier', min: 1, max: 30 },
			{ key: 'sabedoria', label: 'Sabedoria', type: 'modifier', min: 1, max: 30 },
			{ key: 'carisma', label: 'Carisma', type: 'modifier', min: 1, max: 30 }
		]
	},
	{
		title: 'Salvaguardas e Perícias',
		fields: [
			{ key: 'bonusDeProficiencia', label: 'Bônus de Proficiência', type: 'number', min: 2, max: 6 },
			{ key: 'salvaguardas', label: 'Salvaguardas com Proficiência', type: 'textarea' },
			{ key: 'pericias', label: 'Perícias', type: 'textarea' }
		]
	},
	{
		title: 'Combate',
		fields: [
			{ key: 'classeDeArmadura', label: 'Classe de Armadura', type: 'number', min: 0 },
			{ key: 'deslocamento', label: 'Deslocamento', type: 'text' },
			{ key: 'dadosDeVida', label: 'Dados de Vida', type: 'text' }
		]
	},
	{
		title: 'Ataques, Magias e Equipamento',
		fields: [
			{ key: 'ataques', label: 'Ataques', type: 'textarea' },
			{ key: 'magias', label: 'Magias Conhecidas', type: 'textarea' },
			{ key: 'equipamento', label: 'Equipamento', type: 'textarea' },
			{ key: 'proficienciasEIdiomas', label: 'Proficiências e Idiomas', type: 'textarea' }
		]
	},
	{
		title: 'Personalidade',
		fields: [
			{ key: 'tracosDePersonalidade', label: 'Traços de Personalidade', type: 'textarea' },
			{ key: 'ideais', label: 'Ideais', type: 'textarea' },
			{ key: 'vinculos', label: 'Vínculos', type: 'textarea' },
			{ key: 'defeitos', label: 'Defeitos', type: 'textarea' }
		]
	}
]

export { DND5E_TEMPLATE }

import type { SheetTemplate } from './types'

const DND5E_TEMPLATE: SheetTemplate = [
	{
		title: 'Identidade',
		fields: [
			{ key: 'classe', label: 'Classe', type: 'text' },
			{ key: 'nivel', label: 'Nível', type: 'number', min: 1, max: 20 },
			{ key: 'raca', label: 'Raça', type: 'text' },
			{ key: 'antecedente', label: 'Antecedente', type: 'text' }
		]
	},
	{
		title: 'Atributos',
		fields: [
			{ key: 'forca', label: 'Força', type: 'number', min: 1, max: 30 },
			{ key: 'destreza', label: 'Destreza', type: 'number', min: 1, max: 30 },
			{ key: 'constituicao', label: 'Constituição', type: 'number', min: 1, max: 30 },
			{ key: 'inteligencia', label: 'Inteligência', type: 'number', min: 1, max: 30 },
			{ key: 'sabedoria', label: 'Sabedoria', type: 'number', min: 1, max: 30 },
			{ key: 'carisma', label: 'Carisma', type: 'number', min: 1, max: 30 }
		]
	},
	{
		title: 'Combate',
		fields: [
			{ key: 'pontosDeVida', label: 'Pontos de Vida', type: 'number', min: 0 },
			{ key: 'classeDeArmadura', label: 'Classe de Armadura', type: 'number', min: 0 },
			{ key: 'deslocamento', label: 'Deslocamento', type: 'text' }
		]
	},
	{
		title: 'Perícias e Equipamento',
		fields: [
			{ key: 'pericias', label: 'Perícias', type: 'textarea' },
			{ key: 'equipamento', label: 'Equipamento', type: 'textarea' }
		]
	}
]

export { DND5E_TEMPLATE }

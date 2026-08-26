import type { SheetTemplate } from './types'

const VAMPIRO_A_MASCARA_TEMPLATE: SheetTemplate = [
	{
		title: 'Identidade',
		fields: [
			{ key: 'cla', label: 'Clã', type: 'text' },
			{ key: 'geracao', label: 'Geração', type: 'number', min: 1, max: 15 },
			{ key: 'natureza', label: 'Natureza', type: 'text' },
			{ key: 'comportamento', label: 'Comportamento', type: 'text' }
		]
	},
	{
		title: 'Atributos Físicos',
		fields: [
			{ key: 'forca', label: 'Força', type: 'number', min: 1, max: 5 },
			{ key: 'destreza', label: 'Destreza', type: 'number', min: 1, max: 5 },
			{ key: 'vigor', label: 'Vigor', type: 'number', min: 1, max: 5 }
		]
	},
	{
		title: 'Atributos Sociais',
		fields: [
			{ key: 'carisma', label: 'Carisma', type: 'number', min: 1, max: 5 },
			{ key: 'manipulacao', label: 'Manipulação', type: 'number', min: 1, max: 5 },
			{ key: 'compostura', label: 'Autocontrole/Compostura', type: 'number', min: 1, max: 5 }
		]
	},
	{
		title: 'Atributos Mentais',
		fields: [
			{ key: 'percepcao', label: 'Percepção', type: 'number', min: 1, max: 5 },
			{ key: 'inteligencia', label: 'Inteligência', type: 'number', min: 1, max: 5 },
			{ key: 'raciocinio', label: 'Raciocínio', type: 'number', min: 1, max: 5 }
		]
	},
	{
		title: 'Traços de Vampiro',
		fields: [
			{ key: 'humanidade', label: 'Humanidade', type: 'number', min: 0, max: 10 },
			{ key: 'forcaDeVontade', label: 'Força de Vontade', type: 'number', min: 1, max: 10 },
			{ key: 'trilhaDeSangue', label: 'Trilha de Sangue', type: 'text' }
		]
	},
	{
		title: 'Disciplinas e Vantagens',
		fields: [
			{ key: 'disciplinas', label: 'Disciplinas', type: 'textarea' },
			{ key: 'vantagensEFraquezas', label: 'Vantagens e Fraquezas', type: 'textarea' }
		]
	}
]

export { VAMPIRO_A_MASCARA_TEMPLATE }

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
			{ key: 'forca', label: 'Força', type: 'dots', min: 1, max: 5 },
			{ key: 'destreza', label: 'Destreza', type: 'dots', min: 1, max: 5 },
			{ key: 'vigor', label: 'Vigor', type: 'dots', min: 1, max: 5 }
		]
	},
	{
		title: 'Atributos Sociais',
		fields: [
			{ key: 'carisma', label: 'Carisma', type: 'dots', min: 1, max: 5 },
			{ key: 'manipulacao', label: 'Manipulação', type: 'dots', min: 1, max: 5 },
			{ key: 'compostura', label: 'Autocontrole/Compostura', type: 'dots', min: 1, max: 5 }
		]
	},
	{
		title: 'Atributos Mentais',
		fields: [
			{ key: 'percepcao', label: 'Percepção', type: 'dots', min: 1, max: 5 },
			{ key: 'inteligencia', label: 'Inteligência', type: 'dots', min: 1, max: 5 },
			{ key: 'raciocinio', label: 'Raciocínio', type: 'dots', min: 1, max: 5 }
		]
	},
	{
		title: 'Habilidades',
		fields: [
			{ key: 'talentos', label: 'Talentos', type: 'textarea' },
			{ key: 'pericias', label: 'Perícias', type: 'textarea' },
			{ key: 'conhecimentos', label: 'Conhecimentos', type: 'textarea' }
		]
	},
	{
		title: 'Virtudes',
		fields: [
			{ key: 'consciencia', label: 'Consciência/Convicção', type: 'dots', min: 1, max: 5 },
			{ key: 'autocontroleOuInstinto', label: 'Autocontrole/Instinto', type: 'dots', min: 1, max: 5 },
			{ key: 'coragem', label: 'Coragem', type: 'dots', min: 1, max: 5 }
		]
	},
	{
		title: 'Traços de Vampiro',
		fields: [
			{ key: 'bussolaMoral', label: 'Humanidade ou Via', type: 'text' },
			{ key: 'nivelDaBussolaMoral', label: 'Nível', type: 'dots', min: 0, max: 10 },
			{ key: 'forcaDeVontade', label: 'Força de Vontade', type: 'dots', min: 1, max: 10 }
		]
	},
	{
		title: 'Disciplinas e Vantagens',
		fields: [
			{ key: 'disciplinas', label: 'Disciplinas', type: 'textarea' },
			{ key: 'antecedentes', label: 'Antecedentes', type: 'textarea' },
			{ key: 'vantagensEFraquezas', label: 'Vantagens e Fraquezas', type: 'textarea' }
		]
	}
]

export { VAMPIRO_A_MASCARA_TEMPLATE }

import { openApiRegistry } from '../../../shared/openapi/registry'
import { createMesaSchema } from '../schemas/createMesa.schema'
import { updateMesaSchema } from '../schemas/updateMesa.schema'
import { deleteMesaSchema } from '../schemas/deleteMesa.schema'
import { getMesaSchema } from '../schemas/getMesa.schema'
import { getAllMesaByCreatorSchema } from '../schemas/getAllMesaByCreator.schema'
import { mesaResponseSchema } from '../schemas/mesaResponse.schema'
import { z } from 'zod'

const mesaResponseExample = {
	id: 1,
	title: 'A Torre Esquecida',
	description: 'Uma antiga torre guarda segredos que poucos ousam buscar.',
	createdAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z',
	isPrivate: false,
	allowSpectators: true,
	maxPlayers: 4,
	creator: {
		id: 1,
		name: 'Fulano'
	},
	countSpectators: 0,
	countPlayers: 1
}

openApiRegistry.registerPath({
	method: 'post',
	path: '/mesas',
	tags: ['Mesas'],
	summary: 'Cria uma nova mesa para o usuário autenticado',
	description: 'O usuário autenticado é definido como criador da mesa e adicionado automaticamente como jogador com a função MASTER.',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'application/json': {
					schema: createMesaSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Mesa criada com sucesso',
			content: {
				'application/json': {
					schema: mesaResponseSchema,
					example: mesaResponseExample
				}
			}
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/mesas/{id}',
	tags: ['Mesas'],
	summary: 'Busca uma mesa pelo id',
	security: [{ bearerAuth: [] }],
	request: {
		params: getMesaSchema
	},
	responses: {
		200: {
			description: 'Mesa encontrada com sucesso',
			content: {
				'application/json': {
					schema: mesaResponseSchema,
					example: mesaResponseExample
				}
			}
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		404: {
			description: 'Mesa não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/mesas/createdBy/{createdBy}',
	tags: ['Mesas'],
	summary: 'Lista todas as mesas criadas por um usuário',
	security: [{ bearerAuth: [] }],
	request: {
		params: getAllMesaByCreatorSchema
	},
	responses: {
		200: {
			description: 'Lista de mesas retornada com sucesso',
			content: {
				'application/json': {
					schema: z.array(mesaResponseSchema),
					example: [mesaResponseExample]
				}
			}
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o usuário consultado'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/mesas',
	tags: ['Mesas'],
	summary: 'Lista todas as mesas',
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: 'Lista de mesas retornada com sucesso',
			content: {
				'application/json': {
					schema: z.array(mesaResponseSchema),
					example: [mesaResponseExample]
				}
			}
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		404: {
			description: 'Nenhuma mesa encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'put',
	path: '/mesas/{id}',
	tags: ['Mesas'],
	summary: 'Atualiza título, descrição, privacidade, espectadores e limite de jogadores de uma mesa',
	security: [{ bearerAuth: [] }],
	request: {
		params: deleteMesaSchema,
		body: {
			content: {
				'application/json': {
					schema: updateMesaSchema.pick({ title: true, description: true, isPrivate: true, allowSpectators: true, maxPlayers: true })
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Mesa atualizada com sucesso',
			content: {
				'application/json': {
					schema: mesaResponseSchema,
					example: mesaResponseExample
				}
			}
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o criador da mesa'
		},
		404: {
			description: 'Mesa não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'delete',
	path: '/mesas/{id}',
	tags: ['Mesas'],
	summary: 'Exclui uma mesa',
	security: [{ bearerAuth: [] }],
	request: {
		params: deleteMesaSchema
	},
	responses: {
		204: {
			description: 'Mesa excluída com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o criador da mesa'
		},
		404: {
			description: 'Mesa não encontrada'
		}
	}
})

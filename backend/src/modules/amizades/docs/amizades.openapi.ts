import { z } from 'zod'
import { openApiRegistry } from '../../../shared/openapi/registry'
import { createAmizadeSchema } from '../schemas/createAmizade.schema'
import { getAmizadeSchema } from '../schemas/getAmizade.schema'
import { deleteAmizadeSchema } from '../schemas/deleteAmizade.schema'
import { getAllAmizadesPaginatedSchema } from '../schemas/getAllAmizadesPaginated.schema'
import { amizadeResponseSchema } from '../schemas/amizadeResponse.schema'

const amizadeResponseExample = {
	id: 1,
	createdAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z',
	userA: { id: 1, name: 'Fulano' },
	userB: { id: 2, name: 'Ciclano' }
}

openApiRegistry.registerPath({
	method: 'post',
	path: '/amizades',
	tags: ['Amizades'],
	summary: 'Cria uma amizade entre o usuário autenticado e outro usuário',
	description: 'Normalmente criada como consequência da aceitação de uma solicitação de PEDIDO_AMIZADE.',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'application/json': {
					schema: createAmizadeSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Amizade criada com sucesso',
			content: {
				'application/json': {
					schema: amizadeResponseSchema,
					example: amizadeResponseExample
				}
			}
		},
		400: {
			description: 'Dados inválidos, amizade consigo mesmo ou amizade já existente'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/amizades',
	tags: ['Amizades'],
	summary: 'Lista paginada das amizades do usuário autenticado',
	security: [{ bearerAuth: [] }],
	request: {
		query: getAllAmizadesPaginatedSchema
	},
	responses: {
		200: {
			description: 'Lista de amizades retornada com sucesso',
			content: {
				'application/json': {
					schema: z.object({
						data: z.array(amizadeResponseSchema),
						meta: z.object({
							total: z.number(),
							page: z.number(),
							limit: z.number(),
							totalPages: z.number()
						})
					}),
					example: {
						data: [amizadeResponseExample],
						meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
					}
				}
			}
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/amizades/{id}',
	tags: ['Amizades'],
	summary: 'Busca uma amizade pelo id',
	description: 'Apenas os usuários participantes da amizade podem visualizá-la.',
	security: [{ bearerAuth: [] }],
	request: {
		params: getAmizadeSchema
	},
	responses: {
		200: {
			description: 'Amizade encontrada com sucesso',
			content: {
				'application/json': {
					schema: amizadeResponseSchema,
					example: amizadeResponseExample
				}
			}
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é participante da amizade'
		},
		404: {
			description: 'Amizade não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'delete',
	path: '/amizades/{id}',
	tags: ['Amizades'],
	summary: 'Desfaz uma amizade',
	description: 'Apenas os usuários participantes da amizade podem desfazê-la.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deleteAmizadeSchema
	},
	responses: {
		204: {
			description: 'Amizade desfeita com sucesso'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é participante da amizade'
		},
		404: {
			description: 'Amizade não encontrada'
		}
	}
})

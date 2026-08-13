import { z } from 'zod'
import { openApiRegistry } from '../../../shared/openapi/registry'
import { getAllNotificacaoPaginatedSchema } from '../schemas/getAllNotificacaoPaginated.schema'
import { notificacaoIdSchema } from '../schemas/notificacaoId.schema'
import { notificacaoResponseSchema } from '../schemas/notificacaoResponse.schema'

const notificacaoResponseExample = {
	id: 1,
	tipo: 'SOLICITACAO_RECEBIDA',
	message: 'Fulano te enviou um pedido de amizade',
	createdAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z',
	readAt: null,
	destino: { id: 2, name: 'Ciclano' },
	remetente: { id: 1, name: 'Fulano' },
	solicitacao: { id: 1, motivo: 'PEDIDO_AMIZADE' },
	mesa: null,
	post: null
}

openApiRegistry.registerPath({
	method: 'get',
	path: '/notificacoes',
	tags: ['Notificações'],
	summary: 'Lista paginada de notificações do usuário autenticado',
	security: [{ bearerAuth: [] }],
	request: {
		query: getAllNotificacaoPaginatedSchema
	},
	responses: {
		200: {
			description: 'Lista de notificações retornada com sucesso',
			content: {
				'application/json': {
					schema: z.object({
						data: z.array(notificacaoResponseSchema),
						meta: z.object({
							total: z.number(),
							page: z.number(),
							limit: z.number(),
							totalPages: z.number()
						})
					}),
					example: {
						data: [notificacaoResponseExample],
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
	path: '/notificacoes/nao-lidas/count',
	tags: ['Notificações'],
	summary: 'Quantidade de notificações não lidas do usuário autenticado',
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: 'Contagem retornada com sucesso',
			content: {
				'application/json': {
					schema: z.object({ count: z.number() }),
					example: { count: 3 }
				}
			}
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		}
	}
})

openApiRegistry.registerPath({
	method: 'patch',
	path: '/notificacoes/ler-todas',
	tags: ['Notificações'],
	summary: 'Marca todas as notificações pendentes do usuário autenticado como lidas',
	security: [{ bearerAuth: [] }],
	responses: {
		204: {
			description: 'Notificações marcadas como lidas com sucesso'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		}
	}
})

openApiRegistry.registerPath({
	method: 'patch',
	path: '/notificacoes/{id}/ler',
	tags: ['Notificações'],
	summary: 'Marca uma notificação como lida',
	description: 'Apenas o destinatário da notificação pode marcá-la como lida.',
	security: [{ bearerAuth: [] }],
	request: {
		params: notificacaoIdSchema
	},
	responses: {
		200: {
			description: 'Notificação marcada como lida com sucesso',
			content: {
				'application/json': {
					schema: notificacaoResponseSchema,
					example: { ...notificacaoResponseExample, readAt: '2026-01-10T12:05:00.000Z' }
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
			description: 'Usuário autenticado não é o destinatário da notificação'
		},
		404: {
			description: 'Notificação não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'delete',
	path: '/notificacoes/{id}',
	tags: ['Notificações'],
	summary: 'Exclui uma notificação do usuário autenticado',
	description: 'Apenas o destinatário da notificação pode excluí-la.',
	security: [{ bearerAuth: [] }],
	request: {
		params: notificacaoIdSchema
	},
	responses: {
		204: {
			description: 'Notificação excluída com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o destinatário da notificação'
		},
		404: {
			description: 'Notificação não encontrada'
		}
	}
})

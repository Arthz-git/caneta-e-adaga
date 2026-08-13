import { z } from 'zod'
import { openApiRegistry } from '../../../shared/openapi/registry'
import { createSolicitacaoSchema } from '../schemas/createSolicitacao.schema'
import { getSolicitacaoSchema } from '../schemas/getSolicitacao.schema'
import { responderSolicitacaoSchema } from '../schemas/responderSolicitacao.schema'
import { cancelarSolicitacaoSchema } from '../schemas/cancelarSolicitacao.schema'
import { deleteSolicitacaoSchema } from '../schemas/deleteSolicitacao.schema'
import { getAllSolicitacaoPaginatedSchema } from '../schemas/getAllSolicitacaoPaginated.schema'
import { getMySolicitacaoByMesaIdSchema } from '../schemas/getMySolicitacaoByMesaId.schema'
import { solicitacaoResponseSchema } from '../schemas/solicitacaoResponse.schema'

const solicitacaoResponseExample = {
	id: 1,
	motivo: 'CONVITE_MESA',
	status: 'PENDENTE',
	createdAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z',
	solicitante: { id: 1, name: 'Fulano' },
	destino: { id: 2, name: 'Ciclano' },
	mesa: { id: 1, title: 'A Torre Esquecida' }
}

openApiRegistry.registerPath({
	method: 'post',
	path: '/solicitacoes',
	tags: ['Solicitações'],
	summary: 'Cria uma nova solicitação para outro usuário',
	description: 'O usuário autenticado é definido como solicitante. O id da mesa é obrigatório quando o motivo é CONVITE_MESA, PEDIDO_ENTRADA_MESA_JOGADOR ou PEDIDO_ENTRADA_MESA_ESPECTADOR.',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'application/json': {
					schema: createSolicitacaoSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Solicitação criada com sucesso',
			content: {
				'application/json': {
					schema: solicitacaoResponseSchema,
					example: solicitacaoResponseExample
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
	path: '/solicitacoes/recebidas',
	tags: ['Solicitações'],
	summary: 'Lista paginada de solicitações recebidas pelo usuário autenticado',
	security: [{ bearerAuth: [] }],
	request: {
		query: getAllSolicitacaoPaginatedSchema
	},
	responses: {
		200: {
			description: 'Lista de solicitações retornada com sucesso',
			content: {
				'application/json': {
					schema: z.object({
						data: z.array(solicitacaoResponseSchema),
						meta: z.object({
							total: z.number(),
							page: z.number(),
							limit: z.number(),
							totalPages: z.number()
						})
					}),
					example: {
						data: [solicitacaoResponseExample],
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
	path: '/solicitacoes/enviadas',
	tags: ['Solicitações'],
	summary: 'Lista paginada de solicitações enviadas pelo usuário autenticado',
	security: [{ bearerAuth: [] }],
	request: {
		query: getAllSolicitacaoPaginatedSchema
	},
	responses: {
		200: {
			description: 'Lista de solicitações retornada com sucesso',
			content: {
				'application/json': {
					schema: z.object({
						data: z.array(solicitacaoResponseSchema),
						meta: z.object({
							total: z.number(),
							page: z.number(),
							limit: z.number(),
							totalPages: z.number()
						})
					}),
					example: {
						data: [solicitacaoResponseExample],
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
	path: '/solicitacoes/mesaId/{mesaId}',
	tags: ['Solicitações'],
	summary: 'Lista as solicitações enviadas pelo usuário autenticado para uma mesa específica',
	security: [{ bearerAuth: [] }],
	request: {
		params: getMySolicitacaoByMesaIdSchema
	},
	responses: {
		200: {
			description: 'Lista de solicitações retornada com sucesso',
			content: {
				'application/json': {
					schema: z.array(solicitacaoResponseSchema),
					example: [solicitacaoResponseExample]
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
	path: '/solicitacoes/{id}',
	tags: ['Solicitações'],
	summary: 'Busca uma solicitação pelo id',
	description: 'Apenas o solicitante ou o destinatário podem visualizar a solicitação.',
	security: [{ bearerAuth: [] }],
	request: {
		params: getSolicitacaoSchema
	},
	responses: {
		200: {
			description: 'Solicitação encontrada com sucesso',
			content: {
				'application/json': {
					schema: solicitacaoResponseSchema,
					example: solicitacaoResponseExample
				}
			}
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é participante da solicitação'
		},
		404: {
			description: 'Solicitação não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'patch',
	path: '/solicitacoes/{id}/responder',
	tags: ['Solicitações'],
	summary: 'Aceita ou recusa uma solicitação pendente',
	description: 'Apenas o destinatário da solicitação pode respondê-la, e apenas enquanto o status for PENDENTE.',
	security: [{ bearerAuth: [] }],
	request: {
		params: cancelarSolicitacaoSchema,
		body: {
			content: {
				'application/json': {
					schema: responderSolicitacaoSchema.pick({ status: true })
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Solicitação respondida com sucesso',
			content: {
				'application/json': {
					schema: solicitacaoResponseSchema,
					example: { ...solicitacaoResponseExample, status: 'ACEITA' }
				}
			}
		},
		400: {
			description: 'Dados inválidos ou solicitação já respondida/cancelada'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o destinatário da solicitação'
		},
		404: {
			description: 'Solicitação não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'patch',
	path: '/solicitacoes/{id}/cancelar',
	tags: ['Solicitações'],
	summary: 'Cancela uma solicitação pendente',
	description: 'Apenas o solicitante pode cancelar, e apenas enquanto o status for PENDENTE.',
	security: [{ bearerAuth: [] }],
	request: {
		params: cancelarSolicitacaoSchema
	},
	responses: {
		200: {
			description: 'Solicitação cancelada com sucesso',
			content: {
				'application/json': {
					schema: solicitacaoResponseSchema,
					example: { ...solicitacaoResponseExample, status: 'CANCELADA' }
				}
			}
		},
		400: {
			description: 'Solicitação já respondida/cancelada'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o solicitante'
		},
		404: {
			description: 'Solicitação não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'delete',
	path: '/solicitacoes/{id}',
	tags: ['Solicitações'],
	summary: 'Exclui uma solicitação já respondida ou cancelada do histórico',
	description: 'Apenas o solicitante ou o destinatário podem excluir, e apenas quando o status não for mais PENDENTE.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deleteSolicitacaoSchema
	},
	responses: {
		204: {
			description: 'Solicitação excluída com sucesso'
		},
		400: {
			description: 'Solicitação ainda está pendente'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é participante da solicitação'
		},
		404: {
			description: 'Solicitação não encontrada'
		}
	}
})

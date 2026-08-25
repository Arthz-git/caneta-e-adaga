import { openApiRegistry } from '../../../shared/openapi/registry'
import { createMesaSchema } from '../schemas/createMesa.schema'
import { updateMesaSchema } from '../schemas/updateMesa.schema'
import { deleteMesaSchema } from '../schemas/deleteMesa.schema'
import { getMesaSchema } from '../schemas/getMesa.schema'
import { getAllMesaByCreatorSchema } from '../schemas/getAllMesaByCreator.schema'
import { getAllMesaPaginatedSchema } from '../schemas/getAllMesaPaginated.schema'
import { mesaResponseSchema, mesaResponseRepository } from '../schemas/mesaResponse.schema'
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
	imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/caneta-e-adaga/mesas/exemplo.jpg',
	creator: {
		id: 1,
		name: 'Fulano'
	},
	countSpectators: 0,
	countPlayers: 1,
	isMember: true,
	lastPostAt: '2026-01-12T18:30:00.000Z'
}

const mesaByIdResponseExample = {
	id: 1,
	title: 'A Torre Esquecida',
	description: 'Uma antiga torre guarda segredos que poucos ousam buscar.',
	createdBy: 1,
	createdAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z',
	isPrivate: false,
	allowSpectators: true,
	maxPlayers: 4,
	imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/caneta-e-adaga/mesas/exemplo.jpg',
	creator: {
		name: 'Fulano'
	},
	players: [
		{
			id: 1,
			userId: 1,
			user: {
				name: 'Fulano'
			},
			mesaId: 1,
			role: 'MASTER',
			userCharacterId: 1,
			userCharacter: {
				name: 'Aldric',
				imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/caneta-e-adaga/characters/exemplo.jpg'
			},
			joinedAt: '2026-01-10T12:00:00.000Z',
			updatedAt: '2026-01-10T12:00:00.000Z',
			isFavorite: false
		}
	]
}

openApiRegistry.registerPath({
	method: 'post',
	path: '/mesas',
	tags: ['Mesas'],
	summary: 'Cria uma nova mesa para o usuário autenticado',
	description: 'O usuário autenticado é definido como criador da mesa e adicionado automaticamente como jogador com a função MASTER. Aceita opcionalmente um arquivo de imagem (campo "image") via multipart/form-data.',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'multipart/form-data': {
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
	description: 'Mesas privadas só podem ser visualizadas pelo criador ou por jogadores/espectadores já vinculados a ela.',
	security: [{ bearerAuth: [] }],
	request: {
		params: getMesaSchema
	},
	responses: {
		200: {
			description: 'Mesa encontrada com sucesso',
			content: {
				'application/json': {
					schema: mesaResponseRepository,
					example: mesaByIdResponseExample
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
			description: 'Mesa é privada e o usuário autenticado não é um jogador dela'
		},
		404: {
			description: 'Mesa não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/mesas/paginated',
	tags: ['Mesas'],
	summary: 'Lista paginada de mesas',
	description: 'Suporta busca por título/descrição e filtro para retornar apenas as mesas em que o usuário autenticado é o criador ou um jogador/espectador (parâmetro "mine").',
	security: [{ bearerAuth: [] }],
	request: {
		query: getAllMesaPaginatedSchema
	},
	responses: {
		200: {
			description: 'Lista de mesas retornada com sucesso',
			content: {
				'application/json': {
					schema: z.object({
						data: z.array(mesaResponseSchema),
						meta: z.object({
							total: z.number(),
							page: z.number(),
							limit: z.number(),
							totalPages: z.number()
						})
					}),
					example: {
						data: [mesaResponseExample],
						meta: { total: 1, page: 1, limit: 9, totalPages: 1 }
					}
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
	summary: 'Atualiza título, descrição, privacidade, espectadores, limite de jogadores e imagem de uma mesa',
	description: 'Aceita opcionalmente um arquivo de imagem (campo "image") via multipart/form-data. Quando nenhum arquivo é enviado, a imagem atual é mantida.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deleteMesaSchema,
		body: {
			content: {
				'multipart/form-data': {
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

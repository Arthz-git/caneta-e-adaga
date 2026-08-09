import { z } from 'zod'
import { openApiRegistry } from '../../../shared/openapi/registry'
import { createPostSchema } from '../schemas/createPost.schema'
import { getAllPostsByMesaIdSchema } from '../schemas/getAllPostsByMesaId.schema'
import { getPaginatedPostsByMesaIdSchema } from '../schemas/getPaginatedPostsByMesaId.schema'
import { postCreateResponseSchema, postResponseSchema } from '../schemas/postResponse.schema'

const postCreateResponseExample = {
	id: 1,
	userId: 1,
	mesaId: 1,
	text: 'Aldric avança em direção à torre, espada em punho.',
	type: 'CHARACTER',
	characterId: 1,
	npcName: null,
	createdAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z'
}

const postResponseExample = {
	...postCreateResponseExample,
	author: { id: 1, name: 'Fulano' },
	character: { id: 1, name: 'Aldric', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/caneta-e-adaga/characters/exemplo.jpg' },
	visiblePlayerIds: []
}

openApiRegistry.registerPath({
	method: 'post',
	path: '/posts',
	tags: ['Posts'],
	summary: 'Cria um post no log de narração de uma mesa',
	description: 'O usuário autenticado precisa ser um jogador da mesa. O id do personagem é obrigatório quando o tipo é CHARACTER, e o nome do NPC é obrigatório quando o tipo é NPC. Por padrão o post é visível para todos os jogadores da mesa; para restringi-lo, informe visiblePlayerIds com os ids (Players) que devem enxergá-lo — o mestre sempre vê todos os posts, e o autor sempre enxerga o próprio post.',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'application/json': {
					schema: createPostSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Post criado com sucesso',
			content: {
				'application/json': {
					schema: postCreateResponseSchema,
					example: postCreateResponseExample
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
			description: 'Usuário autenticado não pertence à mesa, ou o personagem informado não pertence ao usuário'
		},
		404: {
			description: 'Mesa ou personagem não encontrados'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/posts/mesaId/{mesaId}',
	tags: ['Posts'],
	summary: 'Lista todos os posts do log de narração de uma mesa',
	description: 'O usuário autenticado precisa ser um jogador da mesa. Retorna ordenado do post mais antigo para o mais recente.',
	security: [{ bearerAuth: [] }],
	request: {
		params: getAllPostsByMesaIdSchema
	},
	responses: {
		200: {
			description: 'Lista de posts retornada com sucesso',
			content: {
				'application/json': {
					schema: z.array(postResponseSchema),
					example: [postResponseExample]
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
			description: 'Usuário autenticado não pertence à mesa'
		},
		404: {
			description: 'Mesa não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/posts/mesaId/{mesaId}/paginated',
	tags: ['Posts'],
	summary: 'Lista paginada dos posts do log de narração de uma mesa',
	description: 'O usuário autenticado precisa ser um jogador da mesa. Retorna ordenado do post mais antigo para o mais recente.',
	security: [{ bearerAuth: [] }],
	request: {
		params: getAllPostsByMesaIdSchema,
		query: getPaginatedPostsByMesaIdSchema.pick({ page: true, limit: true })
	},
	responses: {
		200: {
			description: 'Lista de posts retornada com sucesso',
			content: {
				'application/json': {
					schema: z.object({
						data: z.array(postResponseSchema),
						meta: z.object({
							total: z.number(),
							page: z.number(),
							limit: z.number(),
							totalPages: z.number()
						})
					}),
					example: {
						data: [postResponseExample],
						meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
					}
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
			description: 'Usuário autenticado não pertence à mesa'
		},
		404: {
			description: 'Mesa não encontrada'
		}
	}
})

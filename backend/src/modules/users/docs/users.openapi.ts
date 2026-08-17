import { z } from 'zod'
import { openApiRegistry } from '../../../shared/openapi/registry'
import { createUserSchema } from '../schemas/createUser.schema'
import { getUserByEmailSchema } from '../schemas/getUserByEmail.schema'
import { getUserByIdSchema } from '../schemas/getUserById.schema'
import { searchUsersByNameSchema } from '../schemas/searchUsersByName.schema'
import { userSearchResultSchema } from '../schemas/userSearchResult.schema'
import { userResponseSchema } from '../schemas/userResponse.schema'

const userResponseExample = {
	id: 1,
	name: 'Fulano de Tal',
	email: 'fulano@email.com',
	role: 200,
	createdAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z'
}

openApiRegistry.registerPath({
	method: 'post',
	path: '/users',
	tags: ['Users'],
	summary: 'Cria um novo usuário',
	request: {
		body: {
			content: {
				'application/json': {
					schema: createUserSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Usuário criado com sucesso',
			content: {
				'application/json': {
					schema: userResponseSchema,
					example: userResponseExample
				}
			}
		},
		400: {
			description: 'Dados inválidos'
		},
		409: {
			description: 'E-mail já está em uso'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/users/email/{email}',
	tags: ['Users'],
	summary: 'Busca um usuário pelo e-mail',
	security: [{ bearerAuth: [] }],
	request: {
		params: getUserByEmailSchema
	},
	responses: {
		200: {
			description: 'Usuário encontrado com sucesso',
			content: {
				'application/json': {
					schema: userResponseSchema,
					example: userResponseExample
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
			description: 'Usuário autenticado não possui permissão de administrador'
		},
		404: {
			description: 'Usuário não encontrado'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/users/search',
	tags: ['Users'],
	summary: 'Busca usuários pelo nome (correspondência parcial)',
	description: 'Retorna até 10 usuários cujo nome contenha o termo pesquisado.',
	security: [{ bearerAuth: [] }],
	request: {
		query: searchUsersByNameSchema
	},
	responses: {
		200: {
			description: 'Lista de usuários retornada com sucesso',
			content: {
				'application/json': {
					schema: z.array(userSearchResultSchema),
					example: [{ id: 1, name: 'Fulano de Tal' }]
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
	path: '/users/{id}',
	tags: ['Users'],
	summary: 'Busca um usuário pelo id',
	security: [{ bearerAuth: [] }],
	request: {
		params: getUserByIdSchema
	},
	responses: {
		200: {
			description: 'Usuário encontrado com sucesso',
			content: {
				'application/json': {
					schema: userResponseSchema,
					example: userResponseExample
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
			description: 'Usuário não encontrado'
		}
	}
})

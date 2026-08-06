import { openApiRegistry } from '../../../shared/openapi/registry'
import { loginSchema } from '../schemas/login.schema'
import { devTokenSchema } from '../schemas/devToken.schema'
import { authResponseSchema } from '../schemas/authResponse.schema'
import { userResponseSchema } from '../../users/schemas/userResponse.schema'
import { env } from '../../../config/env'

const authResponseExample = {
	user: {
		id: 1,
		name: 'Fulano de Tal',
		email: 'fulano@email.com',
		role: 200,
		createdAt: '2026-01-10T12:00:00.000Z',
		updatedAt: '2026-01-10T12:00:00.000Z'
	},
	accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}

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
	path: '/auth/login',
	tags: ['Auth'],
	summary: 'Autentica um usuário',
	request: {
		body: {
			content: {
				'application/json': {
					schema: loginSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Usuário autenticado com sucesso',
			content: {
				'application/json': {
					schema: authResponseSchema,
					example: authResponseExample
				}
			}
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'E-mail ou senha inválidos'
		}
	}
})

openApiRegistry.registerPath({
	method: 'post',
	path: '/auth/logout',
	tags: ['Auth'],
	summary: 'Revoga o refresh token do usuário (enviado via cookie httpOnly "refreshToken")',
	responses: {
		204: {
			description: 'Logout realizado com sucesso'
		},
		401: {
			description: 'Refresh token inválido'
		}
	}
})

openApiRegistry.registerPath({
	method: 'post',
	path: '/auth/refresh',
	tags: ['Auth'],
	summary: 'Renova o access token a partir do refresh token enviado via cookie httpOnly "refreshToken"',
	responses: {
		200: {
			description: 'Token renovado com sucesso',
			content: {
				'application/json': {
					schema: authResponseSchema,
					example: authResponseExample
				}
			}
		},
		401: {
			description: 'Refresh token inválido'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/auth/me',
	tags: ['Auth'],
	summary: 'Retorna os dados do usuário autenticado',
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: 'Usuário retornado com sucesso',
			content: {
				'application/json': {
					schema: userResponseSchema,
					example: userResponseExample
				}
			}
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		404: {
			description: 'Usuário não encontrado'
		}
	}
})

if (env.NODE_ENV !== 'production') {
	openApiRegistry.registerPath({
		method: 'post',
		path: '/auth/dev-token',
		tags: ['Auth'],
		summary: '[DEV] Gera um access token para um usuário existente, sem senha. Indisponível em produção.',
		request: {
			body: {
				content: {
					'application/json': {
						schema: devTokenSchema
					}
				}
			}
		},
		responses: {
			200: {
				description: 'Token gerado com sucesso',
				content: {
					'application/json': {
						example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
					}
				}
			},
			400: {
				description: 'Dados inválidos'
			},
			404: {
				description: 'Usuário não encontrado'
			}
		}
	})
}

openApiRegistry.registerPath({
	method: 'post',
	path: '/auth/logout-all',
	tags: ['Auth'],
	summary: 'Revoga todos os refresh tokens do usuário autenticado',
	security: [{ bearerAuth: [] }],
	responses: {
		204: {
			description: 'Logout de todos os dispositivos realizado com sucesso'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		}
	}
})

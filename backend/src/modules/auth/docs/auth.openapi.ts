import { openApiRegistry } from '../../../shared/openapi/registry'
import { loginSchema } from '../schemas/login.schema'
import { logoutSchema } from '../schemas/logout.schema'
import { refreshTokenSchema } from '../schemas/refreshToken.schema'

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
			description: 'Usuário autenticado com sucesso'
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
	summary: 'Revoga o refresh token de um usuário',
	request: {
		body: {
			content: {
				'application/json': {
					schema: logoutSchema
				}
			}
		}
	},
	responses: {
		204: {
			description: 'Logout realizado com sucesso'
		},
		400: {
			description: 'Dados inválidos'
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
	summary: 'Renova o access token a partir de um refresh token válido',
	request: {
		body: {
			content: {
				'application/json': {
					schema: refreshTokenSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Token renovado com sucesso'
		},
		400: {
			description: 'Dados inválidos'
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
			description: 'Usuário retornado com sucesso'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		404: {
			description: 'Usuário não encontrado'
		}
	}
})

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

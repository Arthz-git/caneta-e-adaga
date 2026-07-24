import { openApiRegistry } from '../../../shared/openapi/registry'
import { createUserSchema } from '../schemas/createUser.schema'
import { getUserByEmailSchema } from '../schemas/getUserByEmail.schema'
import { getUserByIdSchema } from '../schemas/getUserById.schema'

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
			description: 'Usuário criado com sucesso'
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
			description: 'Usuário encontrado com sucesso'
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
	path: '/users/{id}',
	tags: ['Users'],
	summary: 'Busca um usuário pelo id',
	security: [{ bearerAuth: [] }],
	request: {
		params: getUserByIdSchema
	},
	responses: {
		200: {
			description: 'Usuário encontrado com sucesso'
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

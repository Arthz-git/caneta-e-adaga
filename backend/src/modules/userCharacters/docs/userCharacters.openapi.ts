import { openApiRegistry } from '../../../shared/openapi/registry'
import { createUserCharacterSchema } from '../schemas/createUserCharacter.schema'
import { updateUserCharacterSchema } from '../schemas/updateUserCharacter.schema'
import { deleteUserCharacterSchema } from '../schemas/deleteUserCharacter.schema'
import { findUserCharacterSchema } from '../schemas/findUserCharacter.schema'
import { findAllUserCharacterByUserIdSchema } from '../schemas/findAllUserCharacterByUserId.schema'

openApiRegistry.registerPath({
	method: 'post',
	path: '/characters',
	tags: ['Characters'],
	summary: 'Cria um novo personagem para o usuário autenticado',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'application/json': {
					schema: createUserCharacterSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Personagem criado com sucesso'
		},
		400: {
			description: 'Dados inválidos ou usuário do token não encontrado'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		}
	}
})

openApiRegistry.registerPath({
	method: 'put',
	path: '/characters',
	tags: ['Characters'],
	summary: 'Atualiza um personagem do usuário autenticado',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'application/json': {
					schema: updateUserCharacterSchema
				}
			}
		}
	},
	responses: {
		204: {
			description: 'Personagem atualizado com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o dono do personagem'
		},
		404: {
			description: 'Personagem não encontrado'
		}
	}
})

openApiRegistry.registerPath({
	method: 'delete',
	path: '/characters/{id}',
	tags: ['Characters'],
	summary: 'Exclui um personagem do usuário autenticado',
	security: [{ bearerAuth: [] }],
	request: {
		params: deleteUserCharacterSchema
	},
	responses: {
		204: {
			description: 'Personagem excluído com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o dono do personagem'
		},
		404: {
			description: 'Personagem não encontrado'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/characters/{id}',
	tags: ['Characters'],
	summary: 'Busca um personagem pelo id',
	security: [{ bearerAuth: [] }],
	request: {
		params: findUserCharacterSchema
	},
	responses: {
		200: {
			description: 'Personagem encontrado com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		404: {
			description: 'Personagem não encontrado'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/characters/userId/{userId}',
	tags: ['Characters'],
	summary: 'Lista todos os personagens de um usuário',
	security: [{ bearerAuth: [] }],
	request: {
		params: findAllUserCharacterByUserIdSchema
	},
	responses: {
		200: {
			description: 'Lista de personagens retornada com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		}
	}
})

import { openApiRegistry } from '../../../shared/openapi/registry'
import { createUserCharacterSchema } from '../schemas/createUserCharacter.schema'
import { deleteUserCharacterSchema } from '../schemas/deleteUserCharacter.schema'
import { getUserCharacterSchema } from '../schemas/getUserCharacter.schema'
import { getAllUserCharacterByUserIdSchema } from '../schemas/getAllUserCharacterByUserId.schema'
import { userCharacterResponseSchema } from '../schemas/userCharacterResponse.schema'
import { z } from 'zod'

const userCharacterResponseExample = {
	id: 1,
	userId: 1,
	name: 'Aldric Ferro Negro',
	description: 'Um mercenário cansado de guerras, em busca de redenção.',
	lore: 'Nascido nas terras geladas do norte, Aldric perdeu tudo em uma guerra que não escolheu lutar...',
	imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/caneta-e-adaga/characters/exemplo.jpg',
	createdAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z'
}

openApiRegistry.registerPath({
	method: 'post',
	path: '/characters',
	tags: ['Characters'],
	summary: 'Cria um novo personagem para o usuário autenticado',
	description: 'Aceita opcionalmente um arquivo de imagem (campo "image") via multipart/form-data.',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'multipart/form-data': {
					schema: createUserCharacterSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Personagem criado com sucesso',
			content: {
				'application/json': {
					schema: userCharacterResponseSchema,
					example: userCharacterResponseExample
				}
			}
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
	path: '/characters/{id}',
	tags: ['Characters'],
	summary: 'Atualiza um personagem do usuário autenticado',
	description: 'Aceita opcionalmente um arquivo de imagem (campo "image") via multipart/form-data. Quando nenhum arquivo é enviado, a imagem atual é mantida.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deleteUserCharacterSchema,
		body: {
			content: {
				'multipart/form-data': {
					schema: createUserCharacterSchema
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
		params: getUserCharacterSchema
	},
	responses: {
		200: {
			description: 'Personagem encontrado com sucesso',
			content: {
				'application/json': {
					schema: userCharacterResponseSchema,
					example: userCharacterResponseExample
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
		params: getAllUserCharacterByUserIdSchema
	},
	responses: {
		200: {
			description: 'Lista de personagens retornada com sucesso',
			content: {
				'application/json': {
					schema: z.array(userCharacterResponseSchema),
					example: [userCharacterResponseExample]
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

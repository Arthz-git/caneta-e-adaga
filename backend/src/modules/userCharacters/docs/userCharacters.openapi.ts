import { openApiRegistry } from '../../../shared/openapi/registry'
import { createUserCharacterSchema } from '../schemas/createUserCharacter.schema'

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

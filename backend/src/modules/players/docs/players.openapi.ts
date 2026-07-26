import { openApiRegistry } from '../../../shared/openapi/registry'
import { createPlayerSchema } from '../schemas/createPlayer.schema'
import { deletePlayerSchema } from '../schemas/deletePlayer.schema'
import { getPlayersByMesaIdSchema } from '../schemas/getPlayersByMesaId.schema'
import { updateRolePlayerSchema } from '../schemas/updateRolePlayer.schema'
import { updateCharacterPlayerSchema } from '../schemas/updateCharacterPlayer.schema'

openApiRegistry.registerPath({
	method: 'post',
	path: '/players',
	tags: ['Players'],
	summary: 'Adiciona um jogador a uma mesa',
	description: 'Apenas o criador da mesa pode adicionar outros usuários. Qualquer usuário autenticado pode adicionar a si mesmo.',
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'application/json': {
					schema: createPlayerSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Jogador adicionado com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não tem permissão para adicionar o jogador, ou o personagem informado não pertence ao usuário'
		},
		404: {
			description: 'Usuário, mesa ou personagem não encontrados'
		},
		409: {
			description: 'Usuário já está nesta mesa'
		}
	}
})

openApiRegistry.registerPath({
	method: 'get',
	path: '/players/mesaId/{mesaId}',
	tags: ['Players'],
	summary: 'Lista os jogadores de uma mesa',
	description: 'O usuário autenticado precisa ser um dos jogadores da mesa.',
	security: [{ bearerAuth: [] }],
	request: {
		params: getPlayersByMesaIdSchema
	},
	responses: {
		200: {
			description: 'Lista de jogadores retornada com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é jogador desta mesa'
		},
		404: {
			description: 'Mesa não encontrada'
		}
	}
})

openApiRegistry.registerPath({
	method: 'patch',
	path: '/players/role/{id}',
	tags: ['Players'],
	summary: 'Atualiza a função (role) de um jogador',
	description: 'Apenas o criador da mesa ou o próprio jogador podem alterar a função.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deletePlayerSchema,
		body: {
			content: {
				'application/json': {
					schema: updateRolePlayerSchema.pick({ role: true })
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Função atualizada com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não tem permissão para atualizar este registro'
		},
		404: {
			description: 'Jogador ou mesa não encontrados'
		}
	}
})

openApiRegistry.registerPath({
	method: 'patch',
	path: '/players/character/{id}',
	tags: ['Players'],
	summary: 'Atualiza o personagem vinculado a um jogador',
	description: 'Apenas o próprio jogador pode alterar o personagem vinculado ao seu registro.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deletePlayerSchema,
		body: {
			content: {
				'application/json': {
					schema: updateCharacterPlayerSchema.pick({ userCharacterId: true })
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Personagem atualizado com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não tem permissão para atualizar este registro'
		},
		404: {
			description: 'Jogador não encontrado'
		}
	}
})

openApiRegistry.registerPath({
	method: 'delete',
	path: '/players/{id}',
	tags: ['Players'],
	summary: 'Remove um jogador de uma mesa',
	description: 'Apenas o criador da mesa ou o próprio jogador podem remover o registro.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deletePlayerSchema
	},
	responses: {
		204: {
			description: 'Jogador removido com sucesso'
		},
		400: {
			description: 'Dados inválidos'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não tem permissão para remover este jogador'
		},
		404: {
			description: 'Jogador ou mesa não encontrados'
		}
	}
})

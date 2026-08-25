import { openApiRegistry } from '../../../shared/openapi/registry'
import { createPlayerSchema } from '../schemas/createPlayer.schema'
import { deletePlayerSchema } from '../schemas/deletePlayer.schema'
import { getPlayersByMesaIdSchema } from '../schemas/getPlayersByMesaId.schema'
import { updateRolePlayerSchema } from '../schemas/updateRolePlayer.schema'
import { updateCharacterPlayerSchema } from '../schemas/updateCharacterPlayer.schema'
import { updateFavoritePlayerSchema } from '../schemas/updateFavoritePlayer.schema'
import { playerResponseSchema } from '../schemas/playerResponse.schema'
import { z } from 'zod'

const playerResponseExample = {
	id: 1,
	userId: 1,
	mesaId: 1,
	role: 'MASTER',
	userCharacterId: null,
	joinedAt: '2026-01-10T12:00:00.000Z',
	updatedAt: '2026-01-10T12:00:00.000Z',
	isFavorite: false
}

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
			description: 'Jogador adicionado com sucesso',
			content: {
				'application/json': {
					schema: playerResponseSchema,
					example: playerResponseExample
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
			description: 'Usuário autenticado não tem permissão para adicionar o jogador, o personagem informado não pertence ao usuário, a mesa já está lotada, ou a mesa já possui um mestre'
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
			description: 'Lista de jogadores retornada com sucesso',
			content: {
				'application/json': {
					schema: z.array(playerResponseSchema),
					example: [playerResponseExample]
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
			description: 'Função atualizada com sucesso',
			content: {
				'application/json': {
					schema: playerResponseSchema,
					example: playerResponseExample
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
			description: 'Usuário autenticado não tem permissão para atualizar este registro, ou a mesa já possui um mestre'
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
	description: 'Apenas o próprio jogador pode alterar o personagem vinculado ao seu registro. Envie "null" para desvincular o personagem atual.',
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
			description: 'Personagem atualizado com sucesso',
			content: {
				'application/json': {
					schema: playerResponseSchema,
					example: playerResponseExample
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
			description: 'Usuário autenticado não tem permissão para atualizar este registro, ou o personagem informado não pertence ao usuário'
		},
		404: {
			description: 'Jogador ou personagem não encontrados'
		},
		409: {
			description: 'O personagem informado já está vinculado a outra mesa'
		}
	}
})

openApiRegistry.registerPath({
	method: 'patch',
	path: '/players/favorite/{id}',
	tags: ['Players'],
	summary: 'Favorita ou desfavorita uma mesa para o jogador',
	description: 'Apenas o próprio jogador pode alterar o campo de favorito do seu registro.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deletePlayerSchema,
		body: {
			content: {
				'application/json': {
					schema: updateFavoritePlayerSchema.pick({ isFavorite: true })
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Favorito atualizado com sucesso',
			content: {
				'application/json': {
					schema: playerResponseSchema,
					example: playerResponseExample
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
			description: 'Usuário autenticado não tem permissão para atualizar este registro'
		},
		404: {
			description: 'Jogador não encontrado'
		}
	}
})

openApiRegistry.registerPath({
	method: 'post',
	path: '/players/notify/{id}',
	tags: ['Players'],
	summary: 'Notifica um jogador de que a mesa depende da sua jogada',
	description: 'Apenas o criador da mesa (mestre) pode notificar um jogador.',
	security: [{ bearerAuth: [] }],
	request: {
		params: deletePlayerSchema
	},
	responses: {
		204: {
			description: 'Jogador notificado com sucesso'
		},
		400: {
			description: 'Dados inválidos, ou o usuário tentou notificar a si mesmo'
		},
		401: {
			description: 'Token não informado, mal formatado ou inválido'
		},
		403: {
			description: 'Usuário autenticado não é o criador da mesa'
		},
		404: {
			description: 'Jogador ou mesa não encontrados'
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

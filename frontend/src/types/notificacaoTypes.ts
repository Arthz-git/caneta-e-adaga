
type TipoNotificacao =
	'SOLICITACAO_RECEBIDA' |
	'SOLICITACAO_ACEITA' |
	'SOLICITACAO_RECUSADA' |
	'NOVO_POST_MESA' |
	'POST_PRIVADO' |
	'JOGADOR_REMOVIDO_MESA' |
	'MESA_EXCLUIDA' |
	'LEMBRETE_JOGADA'

interface NotificacaoResponse {
	id: number
	tipo: TipoNotificacao
	message: string
	createdAt: Date
	updatedAt: Date
	readAt: Date | null
	destino: {
		id: number
		name: string
	}
	remetente: {
		id: number
		name: string
	} | null
	solicitacao: {
		id: number
		motivo: string
	} | null
	mesa: {
		id: number
		title: string
	} | null
	post: {
		id: number
	} | null
}

interface PaginationMeta {
	total: number
	page: number
	limit: number
	totalPages: number
}

interface PaginatedNotificacaoResponse {
	data: NotificacaoResponse[]
	meta: PaginationMeta
}

interface GetAllNotificacaoParams {
	page?: number
	limit?: number
	apenasNaoLidas?: boolean
}

export type {
	TipoNotificacao,
	NotificacaoResponse,
	PaginatedNotificacaoResponse,
	GetAllNotificacaoParams
}

import type { NotificacaoModel } from '../../../generated/prisma/models'
import type { CreateNotificacaoDTO } from '../schemas/createNotificacao.schema'
import type { NotificacaoResponseRepository } from '../schemas/notificacaoResponse.schema'

export interface GetAllPaginatedParams {
	page: number
	limit: number
	apenasNaoLidas?: boolean
}

export interface GetAllPaginatedResult {
	data: NotificacaoResponseRepository[]
	total: number
}

export interface INotificacoesRepository {
	create(data: CreateNotificacaoDTO): Promise<NotificacaoModel>
	get(id: number): Promise<NotificacaoResponseRepository | null>
	getAllByDestinoPaginated(destinoId: number, params: GetAllPaginatedParams): Promise<GetAllPaginatedResult>
	countNaoLidas(destinoId: number): Promise<number>
	markAsRead(id: number): Promise<NotificacaoModel>
	markAllAsRead(destinoId: number): Promise<void>
	delete(id: number): Promise<void>
}

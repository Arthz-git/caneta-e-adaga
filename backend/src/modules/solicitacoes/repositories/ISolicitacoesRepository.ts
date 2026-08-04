import type { SolicitacaoModel } from '../../../generated/prisma/models'
import type { CreateSolicitacaoDTO } from '../schemas/createSolicitacao.schema'
import type { SolicitacaoResponseRepository } from '../schemas/solicitacaoResponse.schema'

export interface GetAllPaginatedParams {
	page: number
	limit: number
	status?: 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'CANCELADA'
	motivo?: 'PEDIDO_AMIZADE' | 'CONVITE_MESA' | 'PEDIDO_ENTRADA_MESA'
}

export interface GetAllPaginatedResult {
	data: SolicitacaoResponseRepository[]
	total: number
}

export interface ISolicitacoesRepository {
	create(data: CreateSolicitacaoDTO): Promise<SolicitacaoModel>
	get(id: number): Promise<SolicitacaoResponseRepository | null>
	updateStatus(id: number, status: 'ACEITA' | 'RECUSADA' | 'CANCELADA', respostaSolicitacao?: string): Promise<SolicitacaoModel>
	delete(id: number): Promise<void>
	getAllRecebidasPaginated(destinoId: number, params: GetAllPaginatedParams): Promise<GetAllPaginatedResult>
	getAllEnviadasPaginated(solicitanteId: number, params: GetAllPaginatedParams): Promise<GetAllPaginatedResult>
}

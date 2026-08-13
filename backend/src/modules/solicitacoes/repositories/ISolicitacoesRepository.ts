import type { SolicitacaoModel } from '../../../generated/prisma/models'
import type { CreateSolicitacaoDTO } from '../schemas/createSolicitacao.schema'
import type { SolicitacaoResponseRepository } from '../schemas/solicitacaoResponse.schema'

export interface GetAllPaginatedParams {
	page: number
	limit: number
	status?: Status
	motivo?: Motivos
}

export interface GetAllPaginatedResult {
	data: SolicitacaoResponseRepository[]
	total: number
}

export type Status = 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'CANCELADA'
export type Motivos = 'PEDIDO_AMIZADE' | 'CONVITE_MESA' | 'PEDIDO_ENTRADA_MESA_ESPECTADOR' | 'PEDIDO_ENTRADA_MESA_JOGADOR'

export interface ISolicitacoesRepository {
	create(data: CreateSolicitacaoDTO): Promise<SolicitacaoModel>
	get(id: number): Promise<SolicitacaoResponseRepository | null>
	updateStatus(id: number, status: Status): Promise<SolicitacaoModel>
	delete(id: number): Promise<void>
	getAllRecebidasPaginated(destinoId: number, params: GetAllPaginatedParams): Promise<GetAllPaginatedResult>
	getAllEnviadasPaginated(solicitanteId: number, params: GetAllPaginatedParams): Promise<GetAllPaginatedResult>
	getMySolicitacaoByMesaId(solicitanteId: number, mesaId: number): Promise<SolicitacaoResponseRepository[]>
}

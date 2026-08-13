import type { CreateSolicitacaoParams, GetAllSolicitacaoParams, PaginatedSolicitacaoResponse, SolicitacaoResponse, Status } from '@/types/solicitacaoTypes'
import api from './api'

async function createSolicitacaoMesa(params: CreateSolicitacaoParams) {
	const response = await api.post('/Solicitacoes', params)

	return response
}

async function getMySolicitacaoByMesaId(mesaId: number) {
	const response = await api.get<SolicitacaoResponse[]>(`/Solicitacoes/mesaId/${mesaId}`)

	return response.data
}

async function getAllSolicitacaoRecebidas(params: GetAllSolicitacaoParams = {}) {
	const response = await api.get<PaginatedSolicitacaoResponse>('/solicitacoes/recebidas', { params })

	return response.data
}

async function getAllSolicitacaoEnviadas(params: GetAllSolicitacaoParams = {}) {
	const response = await api.get<PaginatedSolicitacaoResponse>('/solicitacoes/enviadas', { params })

	return response.data
}

async function responderSolicitacao(id: number, status: Extract<Status, 'ACEITA' | 'RECUSADA'>) {
	const response = await api.patch<SolicitacaoResponse>(`/solicitacoes/${id}/responder`, { status })

	return response.data
}

async function cancelarSolicitacao(id: number) {
	const response = await api.patch<SolicitacaoResponse>(`/solicitacoes/${id}/cancelar`)

	return response.data
}

async function deleteSolicitacao(id: number) {
	await api.delete(`/solicitacoes/${id}`)
}

export {
	createSolicitacaoMesa,
	getMySolicitacaoByMesaId,
	getAllSolicitacaoRecebidas,
	getAllSolicitacaoEnviadas,
	responderSolicitacao,
	cancelarSolicitacao,
	deleteSolicitacao
}
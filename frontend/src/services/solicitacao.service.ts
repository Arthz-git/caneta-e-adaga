import type { CreateSolicitacaoParams, SolicitacaoResponse } from '@/types/solicitacaoTypes'
import api from './api'

async function createSolicitacaoMesa(params: CreateSolicitacaoParams) {
	const response = await api.post('/Solicitacoes', params)

	return response
}

async function getMySolicitacaoByMesaId(mesaId: number) {
	const response = await api.get<SolicitacaoResponse[]>(`/Solicitacoes/mesaId/${mesaId}`)

	return response.data
}

export {
	createSolicitacaoMesa,
	getMySolicitacaoByMesaId
}
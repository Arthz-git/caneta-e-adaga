import type { GetAllNotificacaoParams, NotificacaoResponse, PaginatedNotificacaoResponse } from '@/types/notificacaoTypes'
import api from './api'

async function getAllNotificacoes(params: GetAllNotificacaoParams = {}) {
	const response = await api.get<PaginatedNotificacaoResponse>('/notificacoes', { params })

	return response.data
}

async function getNaoLidasCount() {
	const response = await api.get<{ count: number }>('/notificacoes/nao-lidas/count')

	return response.data.count
}

async function markNotificacaoAsRead(id: number) {
	const response = await api.patch<NotificacaoResponse>(`/notificacoes/${id}/ler`)

	return response.data
}

async function markAllNotificacoesAsRead() {
	await api.patch('/notificacoes/ler-todas')
}

async function deleteNotificacao(id: number) {
	await api.delete(`/notificacoes/${id}`)
}

export {
	getAllNotificacoes,
	getNaoLidasCount,
	markNotificacaoAsRead,
	markAllNotificacoesAsRead,
	deleteNotificacao
}

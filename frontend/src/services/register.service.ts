
import type { RegisterParams, RegisterResponse } from '@/types/registerTypes'
import api from './api'

async function registerUserService(params: RegisterParams) {
	const response = await api.post<RegisterResponse>('/users', params)

	return response.data
}

export {
	registerUserService
}
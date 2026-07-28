import api from './api'

import type { LoginResponseType } from '@/types/loginResponseType'

async function loginService(email: string, password: string) {
	const payload = {
		email: email.trim(),
		password: password.trim()
	}

	const response = await api.post<LoginResponseType>('/auth/login', payload)

	return response.data
}

async function refreshTokenService() {
	const response = await api.post<LoginResponseType>('/auth/refresh')

	return response.data
}

async function logoutService() {
	await api.post('/auth/logout')
}

export {
	loginService,
	refreshTokenService,
	logoutService
}
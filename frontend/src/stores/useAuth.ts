import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserType } from '@/types/userType'
import type { LoginResponseType } from '@/types/loginResponseType'
import { loginService, refreshTokenService, logoutService } from '@/services/auth.service'
import { user as userLocalStorage } from '@/constants/localStorageKeys'
import api, { setAuthHandlers } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {

	const user = ref<UserType | null>(null)
	const isConnected = ref(false)

	const applySession = (response: LoginResponseType) => {
		localStorage.setItem(userLocalStorage, JSON.stringify(response))

		user.value = {
			id: response.user.id,
			username: response.user.name,
			email: response.user.email,
			role: response.user.role,
			accessToken: response.accessToken
		}
		isConnected.value = true

		api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`
	}

	const clearSession = () => {
		localStorage.removeItem(userLocalStorage)
		user.value = null
		isConnected.value = false
		delete api.defaults.headers.common['Authorization']
	}

	const login = async (email: string, password: string) => {
		const response = await loginService(email, password)
		applySession(response)
	}

	const logout = async () => {
		try {
			await logoutService()
		}
		finally {
			clearSession()
		}
	}

	const refresh = async () => {
		const response = await refreshTokenService()
		applySession(response)
		return response.accessToken
	}

	setAuthHandlers({ refresh, onRefreshFailed: clearSession })

	const init = () => {
		const raw = localStorage.getItem(userLocalStorage)
		if (!raw) return

		try {
			const response = JSON.parse(raw) as LoginResponseType
			applySession(response)
		}
		catch {
			localStorage.removeItem(userLocalStorage)
		}
	}

	return {
		user,
		isConnected,
		login,
		logout,
		init,
		refresh
	}
})
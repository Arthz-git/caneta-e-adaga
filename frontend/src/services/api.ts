import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true
})

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

interface AuthHandlers {
	refresh: () => Promise<string>
	onRefreshFailed: () => void
}

let authHandlers: AuthHandlers | null = null
let refreshPromise: Promise<string> | null = null

function setAuthHandlers(handlers: AuthHandlers) {
	authHandlers = handlers
}

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<{ message?: string, issues?: { message?: string }[] }>) => {
		const originalRequest = error.config as RetriableConfig | undefined
		const isRefreshCall = originalRequest?.url?.includes('/auth/refresh')

		if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall && authHandlers) {
			originalRequest._retry = true

			try {
				refreshPromise ??= authHandlers.refresh().finally(() => {
					refreshPromise = null
				})

				const accessToken = await refreshPromise

				originalRequest.headers.set('Authorization', `Bearer ${accessToken}`)

				return axiosInstance(originalRequest)
			}
			catch {
				authHandlers.onRefreshFailed()
				window.location.href = '/auth/login'
				return Promise.reject(new Error('Sessão expirada. Faça login novamente.'))
			}
		}

		const issues = error.response?.data?.issues
		const message = issues?.length
			? issues.map((issue) => issue.message).filter(Boolean).join('; ')
			: error.response?.data?.message ?? 'Não foi possível completar a operação. Tente novamente.'

		return Promise.reject(new Error(message))
	}
)

export default axiosInstance
export { setAuthHandlers }
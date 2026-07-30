import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/useAuth'
import CharactersView from '@/views/CharactersView.vue'
import MesasView from '@/views/MesasView.vue'

declare module 'vue-router' {
	interface RouteMeta {
		requiresAuth?: boolean
		requiresGuest?: boolean
	}
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: DashboardLayout,
			children: [
				{
					path: '',
					name: 'home',
					component: () => import('@/views/HomeView.vue'),
					meta: { requiresAuth: true }
				},
				{
					path: '/characters',
					name: 'characters',
					component: CharactersView,
					meta: { requiresAuth: true }
				},
				{
					path: '/mesas',
					name: 'mesas',
					component: MesasView,
					meta: { requiresAuth: true }
				}
			]
		},
		{
			path: '/auth',
			component: AuthLayout,
			children: [
				{
					path: 'login',
					name: 'login',
					component: LoginView,
					meta: { requiresGuest: true }
				},
				{
					path: 'register',
					name: 'register',
					component: RegisterView,
					meta: { requiresGuest: true }
				}
			]
		}
	]
})

router.beforeEach((to) => {
	const auth = useAuthStore()

	if (to.meta.requiresGuest && auth.isConnected) {
		return { name: 'home' }
	}

	if (to.meta.requiresAuth && !auth.isConnected) {
		return { name: 'login' }
	}
})

export default router
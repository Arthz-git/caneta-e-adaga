import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: DefaultLayout,
			children: [
				{
					path: '',
					name: 'home',
					component: () => import('@/views/HomeView.vue'),
				},
			],
		},
		{
			path: '/auth',
			component: AuthLayout,
			children: [
				{
					path: 'login',
					name: 'login',
					component: LoginView
				},
				{
					path: 'register',
					name: 'register',
					component: RegisterView
				}
			]
		}
	]
})

export default router
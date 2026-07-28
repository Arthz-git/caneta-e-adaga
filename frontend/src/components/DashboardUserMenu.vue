<script setup lang="ts">
import { computed, h } from 'vue'
import { NDropdown, NAvatar, NIcon } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { useRouter } from 'vue-router'
import IconLogOut from '~icons/feather/log-out'
import { useAuthStore } from '@/stores/useAuth'

const authStore = useAuthStore()
const router = useRouter()

const iniciais = computed(() => {
	const nome = authStore.user?.username ?? ''
	return nome
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((parte) => parte[0]?.toUpperCase())
		.join('')
})

const options: DropdownOption[] = [
	{
		label: 'Sair',
		key: 'logout',
		icon: () => h(NIcon, null, { default: () => h(IconLogOut) }),
	},
]

const handleSelect = async (key: string) => {
	if (key === 'logout') {
		await authStore.logout()
		router.push({ name: 'login' })
	}
}
</script>

<template>
	<n-dropdown trigger="click" :options="options" @select="handleSelect">
		<button type="button" class="user-menu">
			<n-avatar round size="small" class="user-menu__avatar">
				{{ iniciais }}
			</n-avatar>

			<span class="user-menu__info">
				<span class="user-menu__name">{{ authStore.user?.username }}</span>
				<span class="user-menu__email">{{ authStore.user?.email }}</span>
			</span>
		</button>
	</n-dropdown>
</template>

<style scoped>
.user-menu {
	display: flex;
	align-items: center;
	gap: var(--space-3);
	padding: var(--space-1) var(--space-2);
	border: none;
	border-radius: 10px;
	background: transparent;
	cursor: pointer;
	transition: background-color 0.15s ease;
}

.user-menu:hover {
	background: var(--cor-linha);
}

.user-menu__avatar {
	background: var(--cor-granada);
	color: var(--cor-papel);
	font-family: var(--font-sans);
	font-weight: 600;
	font-size: 0.8rem;
}

.user-menu__info {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	line-height: 1.25;
}

.user-menu__name {
	font-family: var(--font-sans);
	font-weight: 600;
	font-size: 0.875rem;
	color: var(--cor-tinta);
}

.user-menu__email {
	font-family: var(--font-sans);
	font-size: 0.75rem;
	color: var(--cor-tinta-fraca);
}

@media (max-width: 640px) {
	.user-menu__info {
		display: none;
	}
}
</style>

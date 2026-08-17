<script setup lang="ts">
import { computed, h } from 'vue'
import { NMenu, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
	HomeOutline as IconHome,
	PeopleOutline as IconUsers,
	GridOutline as IconTable,
	MailOutline as IconMail,
	PersonOutline as IconFriends
} from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()

const menuOptions: MenuOption[] = [
	{
		label: () => h(RouterLink, { to: { name: 'home' } }, { default: () => 'Início' }),
		key: 'home',
		icon: () => h(NIcon, null, { default: () => h(IconHome) })
	},
	{
		label: () => h(RouterLink, { to: { name: 'characters' } }, { default: () => 'Personagens' }),
		key: 'characters',
		icon: () => h(NIcon, null, { default: () => h(IconUsers) })
	},
	{
		label: () => h(RouterLink, { to: { name: 'mesas' } }, { default: () => 'Mesas' }),
		key: 'mesas',
		icon: () => h(NIcon, null, { default: () => h(IconTable) })
	},
	{
		label: () => h(RouterLink, { to: { name: 'solicitacoes' } }, { default: () => 'Solicitações' }),
		key: 'solicitacoes',
		icon: () => h(NIcon, null, { default: () => h(IconMail) })
	},
	{
		label: () => h(RouterLink, { to: { name: 'amizades' } }, { default: () => 'Amigos' }),
		key: 'amizades',
		icon: () => h(NIcon, null, { default: () => h(IconFriends) })
	}
]

const selectedKey = computed(() => route.name as string)
</script>

<template>
	<aside class="dashboard-sidebar">
		<RouterLink :to="{ name: 'home' }" class="dashboard-sidebar__brand">
			<span class="dashboard-sidebar__brand-text">Caneta <span class="dashboard-sidebar__brand-amp">&amp;</span> Adaga</span>
		</RouterLink>

		<n-menu
			:value="selectedKey"
			:options="menuOptions"
			:root-indent="24"
			@update:value="(key: string) => router.push({ name: key })"
		/>
	</aside>
</template>

<style scoped>
.dashboard-sidebar {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: var(--cor-papel-elevado);
	border-right: 1px solid var(--cor-linha);
	overflow-y: auto;
}

.dashboard-sidebar__brand {
	display: flex;
	align-items: center;
	height: 64px;
	padding: 0 var(--space-4);
	border-bottom: 1px solid var(--cor-linha);
	text-decoration: none;
	transition: background-color 0.15s ease;
}

.dashboard-sidebar__brand:hover {
	background: var(--cor-linha);
}

.dashboard-sidebar__brand-text {
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 1.1rem;
	letter-spacing: -0.01em;
	color: var(--cor-tinta);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.dashboard-sidebar__brand-amp {
	color: var(--cor-granada);
	font-style: italic;
}
</style>

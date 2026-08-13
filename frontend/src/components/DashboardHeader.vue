<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { MenuOutline as IconMenu } from '@vicons/ionicons5'
import ThemeToggle from '@/components/ThemeToggle.vue'
import DashboardUserMenu from '@/components/DashboardUserMenu.vue'
import NotificacoesMenu from '@/components/NotificacoesMenu.vue'

defineEmits<{
	'toggle-sidebar': []
}>()
</script>

<template>
	<header class="dashboard-header">
		<button
			type="button"
			class="dashboard-header__menu-btn"
			aria-label="Alternar menu lateral"
			@click="$emit('toggle-sidebar')"
		>
			<n-icon size="20">
				<IconMenu />
			</n-icon>
		</button>

		<div class="dashboard-header__spacer" />

		<div class="dashboard-header__actions">
			<ThemeToggle />
			<NotificacoesMenu />
			<span class="dashboard-header__divider" />
			<DashboardUserMenu />
		</div>
	</header>
</template>

<style scoped>
.dashboard-header {
	height: 64px;
	display: flex;
	align-items: center;
	gap: var(--space-4);
	padding: 0 var(--space-4);
	background: var(--cor-papel-elevado);
	border-bottom: 1px solid var(--cor-linha);
}

.dashboard-header__menu-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border: none;
	border-radius: 8px;
	background: transparent;
	color: var(--cor-tinta);
	cursor: pointer;
}

.dashboard-header__menu-btn:hover {
	background: var(--cor-linha);
}

.dashboard-header__spacer {
	flex: 1;
}

.dashboard-header__actions {
	display: flex;
	align-items: center;
	gap: var(--space-4);
}

.dashboard-header__divider {
	width: 1px;
	height: 24px;
	background: var(--cor-linha);
}
</style>

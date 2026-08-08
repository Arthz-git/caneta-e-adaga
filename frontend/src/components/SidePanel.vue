<script setup lang="ts">
import { NIcon, NButton } from 'naive-ui'
import { ChevronForwardOutline as IconCollapse, ChevronBackOutline as IconExpand } from '@vicons/ionicons5'

// ----------------------------------------------------------------------

const isCollapsed = defineModel<boolean>('collapsed', { default: false })

function toggleButtonClick() {
	isCollapsed.value = !isCollapsed.value
}
</script>

<template>
	<aside class="side-panel" :class="{ 'side-panel--collapsed': isCollapsed }">
		<n-button
			circle
			quaternary
			size="small"
			:focusable="false"
			class="side-panel__toggle"
			:aria-label="isCollapsed ? 'Expandir painel' : 'Recolher painel'"
			@click.prevent="toggleButtonClick"
		>
			<template #icon>
				<n-icon>
					<IconExpand v-if="isCollapsed" />
					<IconCollapse v-else />
				</n-icon>
			</template>
		</n-button>

		<div class="side-panel__content-wrapper">
			<div class="side-panel__content">
				<slot />
			</div>
		</div>
	</aside>
</template>

<style scoped>
.side-panel {
	position: relative;
	display: flex;
	flex-direction: column;
	min-height: 0;
	height: 100%;

	border-left: 1px solid var(--cor-linha);
	background: var(--cor-papel-elevado);
	transition: border-color 0.2s ease;
}

.side-panel--collapsed {
	border-left-color: transparent;
}

.side-panel__toggle {
	position: absolute;
	top: 50%;
	left: 0;
	transform: translate(-50%, -50%);
	z-index: 1;

	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.side-panel__content-wrapper {
	flex: 1;
	min-height: 0;
	width: 280px;
	overflow: hidden;

	transition: width 0.2s ease;
}

.side-panel--collapsed .side-panel__content-wrapper {
	width: 0;
}

.side-panel__content {
	height: 100%;
	width: 280px;
	overflow-y: auto;

	padding: var(--space-4);
	scrollbar-width: thin;
	scrollbar-color: var(--cor-linha) transparent;
}

.side-panel__content::-webkit-scrollbar {
	width: 6px;
}

.side-panel__content::-webkit-scrollbar-thumb {
	background: var(--cor-linha);
	border-radius: 3px;
}

.side-panel__content::-webkit-scrollbar-track {
	background: transparent;
}
</style>

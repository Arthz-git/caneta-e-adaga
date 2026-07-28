<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import IconSun from '~icons/feather/sun'
import IconMoon from '~icons/feather/moon'
import { useThemeStore } from '@/stores/useTheme'

const themeStore = useThemeStore()
</script>

<template>
	<n-button
		quaternary
		circle
		:aria-label="themeStore.mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'"
		@click="themeStore.toggle"
	>
		<template #icon>
			<n-icon>
				<IconSun v-if="themeStore.mode === 'dark'" />
				<IconMoon v-else />
			</n-icon>
		</template>
	</n-button>
</template>

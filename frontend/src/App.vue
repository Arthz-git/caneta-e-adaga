<script setup lang="ts">
import { computed } from 'vue'
import {
	NConfigProvider,
	darkTheme,
	NMessageProvider,
	NDialogProvider
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { useThemeStore } from '@/stores/useTheme'

const useTheme = useThemeStore()
const naiveTheme = computed(() => (useTheme.mode === 'dark' ? darkTheme : null))

/* naive-ui processa essas cores via JS (seemly/rgba), então precisam ser valores
   literais — não aceitam var(--...), que só é resolvido pelo motor CSS do navegador. */
const paletas = {
	light: {
		primaryColor: '#7c2436',
		primaryColorHover: '#8a6a3c',
		primaryColorPressed: '#5e1b28',
	},
	dark: {
		primaryColor: '#c14a5e',
		primaryColorHover: '#cfa869',
		primaryColorPressed: '#e2879a',
	},
}

const themeOverrides = computed<GlobalThemeOverrides>(() => ({
	common: {
		fontFamily: 'var(--font-sans)',
		fontFamilyMono: 'var(--font-mono)',
		...paletas[useTheme.mode],
	},
}))
</script>

<template>
	<n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
		<n-messageProvider>
			<n-dialog-provider>
				<router-view />
			</n-dialog-provider>
		</n-messageProvider>
	</n-config-provider>
</template>

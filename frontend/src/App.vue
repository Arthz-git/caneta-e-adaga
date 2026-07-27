<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
	common: {
		fontFamily: 'var(--font-sans)',
		fontFamilyMono: 'var(--font-mono)',
		primaryColor: '#7c2436',
		primaryColorHover: '#8a6a3c',
		primaryColorPressed: '#5e1b28',
	},
}
</script>

<template>
	<n-config-provider :theme-overrides="themeOverrides">
		<router-view />
	</n-config-provider>
</template>

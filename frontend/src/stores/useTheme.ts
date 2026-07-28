import { themeKey } from '@/constants/localStorageKeys'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

function getInitialTheme(): ThemeMode {
	const stored = localStorage.getItem(themeKey)
	if (stored === 'light' || stored === 'dark') return stored

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
	const mode = ref<ThemeMode>(getInitialTheme())

	watch(
		mode,
		(value) => {
			document.documentElement.dataset.theme = value
			localStorage.setItem(themeKey, value)
		},
		{ immediate: true },
	)

	function toggle() {
		mode.value = mode.value === 'dark' ? 'light' : 'dark'
	}

	return { mode, toggle }
})

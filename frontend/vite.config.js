import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import customMedia from 'postcss-custom-media'

export default defineConfig({
	plugins: [
		vue(),
		Icons({ compiler: 'vue3' })
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	css: {
		postcss: {
			plugins: [customMedia()],
		},
	},
})

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import Typewriter from 'typewriter-effect/dist/core'
import { trechos } from '@/constants/trechos'

const containerRef = useTemplateRef<HTMLDivElement>('container')

let typewriter: InstanceType<typeof Typewriter> | null = null

let lastIndex = -1

function pickRandomTrecho() {
	let index = Math.floor(Math.random() * trechos.length)
	if (trechos.length > 1) {
		while (index === lastIndex) {
			index = Math.floor(Math.random() * trechos.length)
		}
	}
	lastIndex = index
	return trechos[index]
}

function playNext() {
	typewriter
		?.typeString(pickRandomTrecho())
		.pauseFor(9000)
		.callFunction(() => containerRef.value?.classList.add('is-fading'))
		.pauseFor(400)
		.deleteAll(1)
		.callFunction(() => {
			containerRef.value?.classList.remove('is-fading')
			// Enfileirar a próxima rodada de forma síncrona aqui faz a
			// própria biblioteca sobrescrever a fila que acabamos de montar
			// (ela recaptura o estado antigo logo após o callback rodar).
			// Adiar para o próximo tick evita essa corrida.
			setTimeout(playNext, 0)
		})
		.start()
}

onMounted(() => {
	if (!containerRef.value) return

	typewriter = new Typewriter(containerRef.value, {
		delay: 45,
	})

	playNext()
})

onBeforeUnmount(() => {
	typewriter?.stop()
})
</script>

<template>
	<div ref="wrapper" class="story-typewriter">
		<div ref="container" class="story-typewriter__text" />
	</div>
</template>

<style scoped>
.story-typewriter {
	position: relative;
	margin-top: var(--space-6);
	width: 72ch;
	max-width: 100%;
	overflow: hidden;
	height: 200px;
}

.story-typewriter__text {
	font-family: var(--font-serif);
	font-style: italic;
	font-size: 1.0625rem;
	line-height: 1.4;
	color: var(--cor-tinta-fraca);
	opacity: 1;
	transition: opacity 0.4s ease;
}

.story-typewriter__text.is-fading {
	opacity: 0;
}

.story-typewriter__text :deep(.Typewriter__cursor) {
	color: var(--accent);
	font-style: normal;
}
</style>

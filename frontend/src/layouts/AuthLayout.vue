<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import StoryTypewriter from '@/components/StoryTypewriter.vue'
</script>

<template>
	<div class="auth-layout">
		<div class="auth-layout__main">
			<h1 class="auth-layout__brand">Caneta <span class="auth-layout__brand-amp">&amp;</span> Adaga</h1>
			<p class="auth-layout__tagline">Onde suas histórias ganham vida, sessão após sessão.</p>

			<StoryTypewriter class="auth-layout__typewriter" />
		</div>
		<div class="auth-layout__side">
			<div class="auth-layout__toggle">
				<ThemeToggle />
			</div>

			<router-view />
		</div>
	</div>
</template>

<style scoped>
.auth-layout {
	display: grid;
	grid-template-columns: 1fr;
	min-height: 100svh;

	@media (min-width: 1025px) {
		grid-template-columns: 6fr 4fr;
	}
}

.auth-layout__main {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: var(--space-page-y) var(--space-page-x);
	background: var(--bg);
}

.auth-layout__typewriter {
	display: none;

	@media (min-width: 640px) {
		display: block;
	}
}

.auth-layout__brand {
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: clamp(2rem, 4vw, 3.25rem);
	letter-spacing: -0.02em;
	color: var(--cor-tinta);
	margin: 0;
}

.auth-layout__brand-amp {
	color: var(--cor-granada);
	font-style: italic;
}

.auth-layout__tagline {
	margin-top: var(--space-4);
	max-width: 32ch;
	font-family: var(--font-serif);
	font-style: italic;
	font-size: 1.125rem;
	color: var(--cor-tinta-fraca);
}

.auth-layout__side {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: var(--space-page-y) var(--space-page-x);
	background: var(--cor-papel-elevado);
	border-top: 1px solid var(--cor-linha);

	@media (min-width: 1025px) {
		border-top: none;
		border-left: 1px solid var(--cor-linha);
	}
}

.auth-layout__toggle {
	position: absolute;
	top: var(--space-4);
	right: var(--space-4);
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'

// ----------------------------------------------------------------------

const props = defineProps<{
	items: string[]
	command: (item: { id: string }) => void
}>()

const selectedIndex = ref(0)

watch(() => props.items, () => {
	selectedIndex.value = 0
})

function selectItem(index: number) {
	const item = props.items[index]

	if (item) {
		props.command({ id: item })
	}
}

function upHandler() {
	selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length
}

function downHandler() {
	selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

defineExpose({
	onKeyDown: ({ event }: { event: KeyboardEvent }) => {
		if (event.key === 'ArrowUp') {
			upHandler()
			return true
		}

		if (event.key === 'ArrowDown') {
			downHandler()
			return true
		}

		if (event.key === 'Enter') {
			selectItem(selectedIndex.value)
			return true
		}

		return false
	}
})
</script>

<template>
	<div class="mention-list">
		<button
			v-for="(item, index) of items"
			:key="item"
			type="button"
			class="mention-list__item"
			:class="{ 'mention-list__item--selected': index === selectedIndex }"
			@click="selectItem(index)"
		>
			{{ item }}
		</button>

		<div v-if="!items.length" class="mention-list__empty">
			Nenhum jogador encontrado
		</div>
	</div>
</template>

<style scoped>
.mention-list {
	display: flex;
	flex-direction: column;
	gap: 2px;

	min-width: 160px;
	padding: var(--space-1);

	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 8px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.mention-list__item {
	padding: 6px var(--space-2);

	text-align: left;

	background: transparent;
	border: none;
	border-radius: 6px;
	color: var(--cor-tinta);
	cursor: pointer;
	font-family: var(--font-sans);
	font-size: 0.85rem;
}

.mention-list__item--selected,
.mention-list__item:hover {
	background: var(--cor-papel);
	color: var(--cor-latao);
}

.mention-list__empty {
	padding: 6px var(--space-2);

	color: var(--cor-tinta-fraca);
	font-size: 0.8rem;
}
</style>

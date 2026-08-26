<script setup lang="ts">
import type { SheetData, SheetTemplate } from '@/constants/characterSheetTemplates'

defineProps<{
	template: SheetTemplate
	sheet: SheetData | null
}>()
</script>

<template>
	<div class="sheet__sections">
		<div v-for="section in template" :key="section.title" class="sheet__section">
			<p class="sheet__section-title">
				{{ section.title }}
			</p>

			<div class="sheet__section-fields">
				<div v-for="field in section.fields" :key="field.key" class="sheet__field">
					<span class="sheet__field-label">{{ field.label }}</span>
					<p class="sheet__field-value">
						{{ sheet?.[field.key] || '—' }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.sheet__sections {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.sheet__section-title {
	margin-bottom: var(--space-2);

	font-family: var(--font-sans);
	font-size: 0.7rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	color: var(--cor-tinta-fraca);

	padding-bottom: var(--space-1);
	border-bottom: 1px solid var(--cor-linha);
}

.sheet__section-fields {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: var(--space-3);
}

.sheet__field {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.sheet__field-label {
	font-family: var(--font-sans);
	font-size: 0.65rem;
	color: var(--cor-tinta-fraca);
}

.sheet__field-value {
	font-family: var(--font-serif);
	font-size: 0.9rem;
	color: var(--cor-tinta);
	white-space: pre-wrap;
	overflow-wrap: break-word;
}
</style>

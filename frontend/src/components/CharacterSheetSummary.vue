<script setup lang="ts">
import type { SheetData, SheetFieldDef, SheetTemplate } from '@/constants/characterSheetTemplates'

defineProps<{
	template: SheetTemplate
	sheet: SheetData | null
}>()

function modifierOf(value: number) {
	const modifier = Math.floor((value - 10) / 2)

	return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

function dotValue(field: SheetFieldDef, sheetValue: SheetData[string] | undefined) {
	return typeof sheetValue === 'number' ? sheetValue : (field.min ?? 0)
}
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

					<div v-if="field.type === 'dots'" class="sheet__dots">
						<span
							v-for="position in (field.max ?? 5)"
							:key="position"
							class="sheet__dot"
							:class="{ 'sheet__dot--filled': position <= dotValue(field, sheet?.[field.key]) }"
						/>
					</div>

					<p v-else-if="field.type === 'modifier'" class="sheet__field-value sheet__field-value--modifier">
						{{ sheet?.[field.key] ?? '—' }}
						<span v-if="typeof sheet?.[field.key] === 'number'" class="sheet__modifier-value">
							{{ modifierOf(sheet[field.key] as number) }}
						</span>
					</p>

					<p v-else class="sheet__field-value">
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

.sheet__field-value--modifier {
	display: flex;
	align-items: baseline;
	gap: var(--space-2);
}

.sheet__modifier-value {
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--cor-tinta-fraca);
}

.sheet__dots {
	display: flex;
	align-items: center;
	gap: 5px;
	flex-wrap: wrap;
}

.sheet__dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	border: 1.5px solid var(--cor-tinta-fraca);
	background: transparent;
}

.sheet__dot--filled {
	background: var(--cor-tinta);
	border-color: var(--cor-tinta);
}
</style>

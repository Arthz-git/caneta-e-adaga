<script setup lang="ts">
import { NFormItem, NInput, NInputNumber } from 'naive-ui'
import type { SheetData, SheetTemplate } from '@/constants/characterSheetTemplates'

defineProps<{
	template: SheetTemplate
}>()

const sheet = defineModel<SheetData>('sheet', { default: () => ({}) })

function updateField(key: string, value: string | number | null) {
	sheet.value = { ...sheet.value, [key]: value ?? '' }
}
</script>

<template>
	<div class="sheet__sections">
		<div v-for="section in template" :key="section.title" class="sheet__section">
			<p class="sheet__section-title">
				{{ section.title }}
			</p>

			<div class="sheet__section-fields">
				<n-form-item
					v-for="field in section.fields"
					:key="field.key"
					:label="field.label"
					:class="{ 'sheet__field--wide': field.type === 'textarea' }"
				>
					<n-input-number
						v-if="field.type === 'number'"
						:value="typeof sheet[field.key] === 'number' ? sheet[field.key] as number : null"
						:min="field.min"
						:max="field.max"
						placeholder=""
						class="sheet__number"
						@update:value="value => updateField(field.key, value)"
					/>

					<n-input
						v-else-if="field.type === 'textarea'"
						:value="typeof sheet[field.key] === 'string' ? sheet[field.key] as string : ''"
						type="textarea"
						placeholder=""
						:autosize="{ minRows: 2, maxRows: 6 }"
						@update:value="value => updateField(field.key, value)"
					/>

					<n-input
						v-else
						:value="typeof sheet[field.key] === 'string' ? sheet[field.key] as string : ''"
						type="text"
						placeholder=""
						@update:value="value => updateField(field.key, value)"
					/>
				</n-form-item>
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

.sheet__field--wide {
	grid-column: 1 / -1;
}

.sheet__number {
	width: 100%;
}
</style>

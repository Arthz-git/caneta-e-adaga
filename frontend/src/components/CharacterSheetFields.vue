<script setup lang="ts">
import { NFormItem, NInput, NInputNumber } from 'naive-ui'
import type { SheetData, SheetFieldDef, SheetTemplate } from '@/constants/characterSheetTemplates'

defineProps<{
	template: SheetTemplate
}>()

const sheet = defineModel<SheetData>('sheet', { default: () => ({}) })

function updateField(key: string, value: string | number | null) {
	sheet.value = { ...sheet.value, [key]: value ?? '' }
}

function modifierOf(value: number) {
	const modifier = Math.floor((value - 10) / 2)

	return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

function dotValue(field: SheetFieldDef, sheetValue: SheetData[string]) {
	return typeof sheetValue === 'number' ? sheetValue : (field.min ?? 0)
}

function selectDot(field: SheetFieldDef, position: number) {
	const min = field.min ?? 0
	const current = dotValue(field, sheet.value[field.key])
	const value = current === position ? Math.max(min, position - 1) : position

	updateField(field.key, value)
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
					<div v-if="field.type === 'dots'" class="sheet__dots">
						<button
							v-for="position in (field.max ?? 5)"
							:key="position"
							type="button"
							class="sheet__dot"
							:class="{ 'sheet__dot--filled': position <= dotValue(field, sheet[field.key]) }"
							:aria-label="`${field.label}: ${position}`"
							@click="selectDot(field, position)"
						/>
					</div>

					<div v-else-if="field.type === 'modifier'" class="sheet__modifier">
						<n-input-number
							:value="typeof sheet[field.key] === 'number' ? sheet[field.key] as number : null"
							:min="field.min"
							:max="field.max"
							placeholder=""
							class="sheet__number"
							@update:value="value => updateField(field.key, value)"
						/>
						<span class="sheet__modifier-value">
							{{ typeof sheet[field.key] === 'number' ? modifierOf(sheet[field.key] as number) : '—' }}
						</span>
					</div>

					<n-input-number
						v-else-if="field.type === 'number'"
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

.sheet__dots {
	display: flex;
	align-items: center;
	gap: 6px;
	flex-wrap: wrap;
}

.sheet__dot {
	width: 16px;
	height: 16px;
	padding: 0;
	border-radius: 50%;
	border: 1.5px solid var(--cor-tinta-fraca);
	background: transparent;
	cursor: pointer;
	transition: background-color 0.15s ease, border-color 0.15s ease;
}

.sheet__dot--filled {
	background: var(--cor-tinta);
	border-color: var(--cor-tinta);
}

.sheet__modifier {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	width: 100%;
}

.sheet__modifier .sheet__number {
	flex: 1;
}

.sheet__modifier-value {
	min-width: 2.5em;
	text-align: center;
	font-family: var(--font-serif);
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--cor-tinta-fraca);
}
</style>

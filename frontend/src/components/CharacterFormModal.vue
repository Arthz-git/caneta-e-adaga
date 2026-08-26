<script setup lang="ts">
import {
	NButton,
	NIcon,
	NModal,
	NForm,
	NTabPane,
	NTabs
} from 'naive-ui'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import { computed, onBeforeUnmount, ref } from 'vue'
import { CloseOutline as IconClose } from '@vicons/ionicons5'
import type { GameSystem } from '@/types/mesaTypes'
import { CHARACTER_SHEET_TEMPLATES, type SheetData } from '@/constants/characterSheetTemplates'
import CharacterDetailsFields from './CharacterDetailsFields.vue'
import CharacterSheetFields from './CharacterSheetFields.vue'

const props = withDefaults(defineProps<{
	heading: string
	imageUrl?: string | null
	rules?: FormRules
	disabled?: boolean
	loading?: boolean
	submitLabel?: string
	gameSystemEditable?: boolean
}>(), {
	imageUrl: null,
	rules: undefined,
	disabled: false,
	loading: false,
	submitLabel: 'Salvar',
	gameSystemEditable: true
})

const emit = defineEmits<{
	submit: []
	'after-leave': []
}>()

const show = defineModel<boolean>('show', { required: true })
const name = defineModel<string>('name', { required: true })
const description = defineModel<string>('description', { required: true })
const lore = defineModel<string>('lore', { required: true })
const gameSystem = defineModel<GameSystem | null>('gameSystem', { default: null })
const sheet = defineModel<SheetData>('sheet', { default: () => ({}) })
const image = defineModel<File | null>('image', { default: null })

const sheetTemplate = computed(() => gameSystem.value ? CHARACTER_SHEET_TEMPLATES[gameSystem.value] : [])

const formRef = ref<FormInst | null>(null)
const imagePreview = ref<string | null>(null)
const activeTab = ref<'detalhes' | 'ficha'>('detalhes')

const displayImage = computed(() => imagePreview.value ?? props.imageUrl)

function resetImage() {
	if (imagePreview.value) {
		URL.revokeObjectURL(imagePreview.value)
	}

	image.value = null
	imagePreview.value = null
}

function handleImageChange(file: UploadFileInfo) {
	if (imagePreview.value) {
		URL.revokeObjectURL(imagePreview.value)
	}

	image.value = file.file ?? null
	imagePreview.value = image.value ? URL.createObjectURL(image.value) : null
}

async function handleSubmit() {
	try {
		await formRef.value?.validate()
	}
	catch {
		return
	}

	emit('submit')
}

function handleAfterLeave() {
	resetImage()
	activeTab.value = 'detalhes'
	emit('after-leave')
}

onBeforeUnmount(resetImage)
</script>

<template>
	<n-modal v-model:show="show" :on-after-leave="handleAfterLeave">
		<div class="modal__container" :class="{ 'modal__container--wide': sheetTemplate.length }">
			<div class="modal__header">
				<h2 class="modal__title">
					{{ heading }}
				</h2>

				<n-button quaternary circle :focusable="false" @click="show = false">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<n-form
				ref="formRef"
				:model="{ name, description, lore, gameSystem }"
				:rules="rules"
				:disabled="disabled"
				class="modal__form"
				label-placement="top"
				@submit.prevent="handleSubmit"
			>
				<n-tabs v-if="sheetTemplate.length" v-model:value="activeTab" type="line" animated>
					<n-tab-pane name="detalhes" tab="Detalhes">
						<CharacterDetailsFields
							v-model:name="name"
							v-model:description="description"
							v-model:lore="lore"
							v-model:game-system="gameSystem"
							:display-image="displayImage"
							:disabled="disabled"
							:game-system-editable="gameSystemEditable"
							@image-change="handleImageChange"
						/>
					</n-tab-pane>

					<n-tab-pane name="ficha" tab="Ficha de personagem">
						<CharacterSheetFields v-model:sheet="sheet" :template="sheetTemplate" />
					</n-tab-pane>
				</n-tabs>

				<CharacterDetailsFields
					v-else
					v-model:name="name"
					v-model:description="description"
					v-model:lore="lore"
					v-model:game-system="gameSystem"
					:display-image="displayImage"
					:disabled="disabled"
					:game-system-editable="gameSystemEditable"
					@image-change="handleImageChange"
				/>

				<n-button
					type="primary"
					attr-type="submit"
					block
					strong
					:loading="loading"
					:disabled="loading"
					:focusable="false"
				>
					{{ submitLabel }}
				</n-button>
			</n-form>
		</div>
	</n-modal>
</template>

<style scoped>
.modal__container {
	width: 90vw;
	max-width: 900px;
	padding: var(--space-6) var(--space-5);
	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	box-shadow: var(--shadow);
}

.modal__container--wide {
	max-width: 1100px;
}

.modal__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: var(--space-5);
}

.modal__title {
	color: var(--cor-granada);
}

.modal__form {
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
}
</style>

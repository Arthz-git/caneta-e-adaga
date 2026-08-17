<script setup lang="ts">
import {
	NButton,
	NIcon,
	NModal,
	NForm,
	NFormItem,
	NInput,
	NUpload
} from 'naive-ui'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import { computed, onBeforeUnmount, ref } from 'vue'
import {
	ImageOutline as IconImage,
	CloseOutline as IconClose
} from '@vicons/ionicons5'

withDefaults(defineProps<{
	heading: string
	imageUrl?: string | null
	rules?: FormRules
	disabled?: boolean
	loading?: boolean
	submitLabel?: string
}>(), {
	imageUrl: null,
	rules: undefined,
	disabled: false,
	loading: false,
	submitLabel: 'Salvar'
})

const emit = defineEmits<{
	submit: []
	'after-leave': []
}>()

const show = defineModel<boolean>('show', { required: true })
const name = defineModel<string>('name', { required: true })
const description = defineModel<string>('description', { required: true })
const lore = defineModel<string>('lore', { required: true })
const image = defineModel<File | null>('image', { default: null })

const formRef = ref<FormInst | null>(null)
const imagePreview = ref<string | null>(null)

const displayImage = computed(() => imagePreview.value)

function resetImage() {
	if (imagePreview.value) {
		URL.revokeObjectURL(imagePreview.value)
	}

	image.value = null
	imagePreview.value = null
}

function handleImageChange({ file }: { file: UploadFileInfo }) {
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
	emit('after-leave')
}

onBeforeUnmount(resetImage)
</script>

<template>
	<n-modal v-model:show="show" :on-after-leave="handleAfterLeave">
		<div class="modal__container">
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
				:model="{ name, description, lore }"
				:rules="rules"
				:disabled="disabled"
				class="modal__form"
				label-placement="top"
				@submit.prevent="handleSubmit"
			>
				<div class="modal__form-body">
					<div class="modal__image">
						<n-upload
							accept="image/*"
							:show-file-list="false"
							:default-upload="false"
							:disabled="disabled"
							@change="handleImageChange"
						>
							<div class="modal__image-preview" :class="{ 'modal__image-preview--disabled': disabled }">
								<img v-if="displayImage ?? imageUrl" :src="(displayImage ?? imageUrl)!" :alt="name" class="modal__image-img">
								<div v-else class="modal__image-placeholder">
									<n-icon size="48">
										<IconImage />
									</n-icon>
									<span>Selecionar imagem</span>
								</div>
							</div>
						</n-upload>
					</div>

					<div class="modal__fields">
						<n-form-item label="Nome" path="name">
							<n-input v-model:value="name" type="text" placeholder="Ex: Elyndra Corvain" />
						</n-form-item>

						<n-form-item label="Descrição" path="description">
							<n-input
								v-model:value="description"
								type="textarea"
								placeholder="Aparência, personalidade, trejeitos... como alguém reconheceria seu personagem em um relance?"
								:autosize="{ minRows: 4, maxRows: 8 }"
							/>
						</n-form-item>

						<n-form-item label="História" path="lore">
							<n-input
								v-model:value="lore"
								type="textarea"
								placeholder="De onde ele veio, o que já viveu, o que carrega consigo até aqui..."
								:autosize="{ minRows: 8, maxRows: 12 }"
							/>
						</n-form-item>
					</div>
				</div>

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

.modal__form-body {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
	align-items: start;
	justify-items: center;
}

.modal__fields {
	min-width: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

@media (min-width: 860px) {
	.modal__form-body {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: var(--space-6);
		justify-items: initial;
	}
}

.modal__image :deep(.n-upload),
.modal__image :deep(.n-upload-trigger) {
	width: 100%;
}

.modal__image {
	width: 100%;
}

.modal__image-preview {
	width: 100%;
	aspect-ratio: 3 / 4;
	border-radius: 12px;
	overflow: hidden;
	border: 1px solid var(--cor-linha);
	background: var(--cor-papel);
	cursor: pointer;
	transition: border-color 0.2s ease;
}

.modal__image-preview:hover {
	border-color: var(--cor-granada);
}

.modal__image-preview--disabled {
	cursor: not-allowed;
	opacity: 0.6;
}

.modal__image-preview--disabled:hover {
	border-color: var(--cor-linha);
}

.modal__image-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.modal__image-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--space-2);
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.8rem;
}
</style>

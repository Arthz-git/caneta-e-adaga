<script setup lang="ts">
import { createMyCharacter, deleteMyCharacter, getMyCharacters, updateMyCharacter } from '@/services/characters.service'
import { useAuthStore } from '@/stores/useAuth'
import { useDialog, useMessage } from 'naive-ui'
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import type { CharactersResponse } from '@/types/charactersTypes'
import { NButton, NIcon, NSpin, NModal, NForm, NFormItem, NInput, NUpload } from 'naive-ui'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import { Add as IconAdd, ImageOutline as IconImage, CloseOutline as IconClose } from '@vicons/ionicons5'
import CardPersonagem from '@/components/CardPersonagem.vue'

const dialog = useDialog()
const message = useMessage()
const auth = useAuthStore()

const formRef = ref<FormInst | null>(null)

const chars = ref<CharactersResponse[]>([])
const isLoading = ref(false)
const showModal = ref(false)

const editId = ref(0) // 0 = false, number = id do usuário para editar

const initialStateForm = {
	name: '',
	description: '',
	lore: ''
}

const characterForm = reactive({ ... initialStateForm })
const characterImage = ref<File | null>(null)
const existingImageUrl = ref<string | null>(null)
const characterImagePreview = ref<string | null>(null)

const displayedImageUrl = computed(() => characterImagePreview.value ?? existingImageUrl.value)

const rules: FormRules = {
	name: {
		required: true,
		message: 'Nome é um campo obrigatório',
		trigger: ['input', 'blur']
	},
	description: {
		required: true,
		message: 'Descrição é um campo obrigatório',
		trigger: ['input', 'blur']
	},
	lore: {
		required: true,
		message: 'História é um campo obrigatório',
		trigger: ['input', 'blur']
	}
}

function handleImageChange({ file }: { file: UploadFileInfo }) {
	characterImage.value = file.file ?? null

	if (characterImagePreview.value) {
		URL.revokeObjectURL(characterImagePreview.value)
	}

	characterImagePreview.value = characterImage.value ? URL.createObjectURL(characterImage.value) : null
}

onBeforeUnmount(() => {
	if (characterImagePreview.value) {
		URL.revokeObjectURL(characterImagePreview.value)
	}
})

function handleAddCharButton() {
	showModal.value = true
}

async function handleAddCharSubmit() {
	try {
		await formRef.value?.validate()

		isLoading.value = true

		await createMyCharacter({ ...characterForm, image: characterImage.value ?? undefined })

		message.success('Personagem criado com sucesso')

		onCloseModal()
		await fetchMyCharacters()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

function handleEditChar(charId: number) {
	const selectedChar = chars.value.find(item => item.id === charId)

	if (selectedChar) {
		characterForm.name = selectedChar.name
		characterForm.description = selectedChar.description
		characterForm.lore = selectedChar.lore
		existingImageUrl.value = selectedChar.imageUrl

		showModal.value = true
		editId.value = charId
	}
}

async function handleEditCharSubmit() {
	try {
		await formRef.value?.validate()

		isLoading.value = true

		const payload = {
			id: editId.value,
			...characterForm,
			image: characterImage.value ?? undefined
		}

		await updateMyCharacter(payload)

		message.success('Personagem atualizado com sucesso')

		onCloseModal()
		await fetchMyCharacters()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

function handleDeleteChar(charId: number) {
	dialog.warning({
		title: 'Confirmar exclusão',
		content: 'Essa ação não pode ser desfeita. Deseja continuar?',
		positiveText: 'Excluir',
		negativeText: 'Cancelar',
		onPositiveClick: () => {
			handleDeleteCharSubmit(charId)
		},
	})
}

async function handleDeleteCharSubmit(charId: number) {
	try {
		isLoading.value = true

		await deleteMyCharacter(charId)

		message.success('Personagem excluído com sucesso')

		await fetchMyCharacters()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

function onCloseModal() {
	showModal.value = false
	Object.assign(characterForm, initialStateForm)

	if (characterImagePreview.value) {
		URL.revokeObjectURL(characterImagePreview.value)
	}

	characterImage.value = null
	characterImagePreview.value = null
	existingImageUrl.value = null
	editId.value = 0
}

async function fetchMyCharacters() {
	try {
		isLoading.value = true

		const myChars = await getMyCharacters(auth.user!.id)

		chars.value = myChars
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

fetchMyCharacters()
</script>

<template>
	<n-modal v-model:show="showModal" :on-after-leave="onCloseModal">
		<div class="modal__container">
			<div class="modal__header">
				<h2 class="modal__title">Novo personagem</h2>

				<n-button quaternary circle :focusable="false" @click="showModal = false">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<n-form ref="formRef" :model="characterForm" :rules="rules" class="modal__form" label-placement="top" @submit.prevent="handleAddCharSubmit">
				<div class="modal__form-body">
					<div class="modal__image">
						<n-upload
							accept="image/*"
							:show-file-list="false"
							:default-upload="false"
							@change="handleImageChange"
						>
							<div class="modal__image-preview">
								<img v-if="displayedImageUrl" :src="displayedImageUrl" alt="Prévia do personagem" class="modal__image-img">
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
							<n-input v-model:value="characterForm.name" type="text" placeholder="Ex: Elyndra Corvain"></n-input>
						</n-form-item>

						<n-form-item
							label="Descrição"
							path="description"
						>
							<n-input
								v-model:value="characterForm.description"
								type="textarea"
								placeholder="Aparência, personalidade, trejeitos... como alguém reconheceria seu personagem em um relance?"
								:autosize="{ minRows: 4, maxRows: 8 }"
							></n-input>
						</n-form-item>

						<n-form-item label="História" path="lore">
							<n-input
								v-model:value="characterForm.lore"
								type="textarea" placeholder="De onde ele veio, o que já viveu, o que carrega consigo até aqui..."
								:autosize="{ minRows: 8, maxRows: 12 }"
							></n-input>
						</n-form-item>
					</div>
				</div>

				<n-button
					type="primary"
					attr-type="submit"
					block
					strong
					:focusable="false"
					v-if="editId === 0"
				>
					Criar
				</n-button>

				<n-button
					type="primary"
					attr-type="submit"
					block
					strong
					:focusable="false"
					v-else
					@click.prevent="handleEditCharSubmit"
				>
					Editar
				</n-button>
			</n-form>
		</div>
	</n-modal>

	<div>
		<div class="mb-5">
			<n-button
				class="add__button"
				type="primary"
				size="large"
				strong
				@click.prevent="handleAddCharButton"
				:focusable="false"
			>
				<template #icon>
					<NIcon>
						<IconAdd />
					</NIcon>
				</template>

				Crie um novo personagem
			</n-button>
		</div>

		<div class="empty__card center__container" v-if="chars.length === 0 ? true : false">
			<p>
				Você ainda não tem um personagem cadastrado
			</p>
		</div>

		<div class="center__container" v-else-if="isLoading">
			<n-spin size="large" />
		</div>

		<div v-else>
			<div class="cards__wrapper">
				<CardPersonagem
					v-for="char in chars"
					:key="char.id"
					:char="char"
					@edit="handleEditChar"
					@delete="handleDeleteChar"
				/>
			</div>
		</div>
	</div>
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

.modal__form {
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
}

.modal__form-body {
	display: flex;
	grid-template-columns: 1fr;
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

.modal__image {
	width: 100%;
}

.modal__image :deep(.n-upload) {
	width: 100%;
}

.modal__image :deep(.n-upload-trigger) {
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

@media (min-width: 860px) {
	.modal__form-body {
		grid-template-columns: 320px 1fr;
		gap: var(--space-6);
		justify-items: initial;
	}
}

.center__container {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;

	height: 100px;
}

.empty__card {
	border-radius: 8px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.empty__card>p {
	font-family: var(--font-sans);
	font-size: 0.85rem;
	color: var(--cor-granada);
}

.add__button {
	border-radius: 10px;
	box-shadow: var(--shadow);
}

.cards__wrapper {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
	gap: var(--space-5);
}
</style>

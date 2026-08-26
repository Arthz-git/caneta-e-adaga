<script setup lang="ts">
import { createMyCharacter, deleteMyCharacter, getMyCharacters, updateMyCharacter } from '@/services/characters.service'
import { useAuthStore } from '@/stores/useAuth'
import { useDialog, useMessage } from 'naive-ui'
import { ref, reactive } from 'vue'
import type { CharactersResponse } from '@/types/charactersTypes'
import type { GameSystem } from '@/types/mesaTypes'
import type { SheetData } from '@/constants/characterSheetTemplates'
import { NButton, NIcon, NSpin } from 'naive-ui'
import type { FormRules } from 'naive-ui'
import { Add as IconAdd } from '@vicons/ionicons5'
import CardPersonagem from '@/components/CardPersonagem.vue'
import CharacterFormModal from '@/components/CharacterFormModal.vue'

const dialog = useDialog()
const message = useMessage()
const auth = useAuthStore()

const chars = ref<CharactersResponse[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)

const editId = ref(0) // 0 = false, number = id do personagem para editar

const initialStateForm = {
	name: '',
	description: '',
	lore: '',
	gameSystem: null as GameSystem | null,
	sheet: {} as SheetData
}

const characterForm = reactive({ ...initialStateForm })
const characterImage = ref<File | null>(null)
const existingImageUrl = ref<string | null>(null)

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
	},
	gameSystem: {
		required: true,
		message: 'Sistema de jogo é um campo obrigatório',
		trigger: ['change', 'blur']
	}
}

function handleAddCharButton() {
	showModal.value = true
}

async function handleFormSubmit() {
	if (editId.value === 0) {
		await handleAddCharSubmit()
	}
	else {
		await handleEditCharSubmit()
	}
}

async function handleAddCharSubmit() {
	try {
		isSubmitting.value = true

		await createMyCharacter({ ...characterForm, gameSystem: characterForm.gameSystem!, image: characterImage.value ?? undefined })

		message.success('Personagem criado com sucesso')

		showModal.value = false
		await fetchMyCharacters()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isSubmitting.value = false
	}
}

function handleEditChar(charId: number) {
	const selectedChar = chars.value.find(item => item.id === charId)

	if (selectedChar) {
		characterForm.name = selectedChar.name
		characterForm.description = selectedChar.description
		characterForm.lore = selectedChar.lore
		characterForm.gameSystem = selectedChar.gameSystem
		characterForm.sheet = selectedChar.sheet ?? {}
		existingImageUrl.value = selectedChar.imageUrl

		showModal.value = true
		editId.value = charId
	}
}

async function handleEditCharSubmit() {
	try {
		isSubmitting.value = true

		const { gameSystem: _gameSystem, ...formData } = characterForm

		const payload = {
			id: editId.value,
			...formData,
			image: characterImage.value ?? undefined
		}

		await updateMyCharacter(payload)

		message.success('Personagem atualizado com sucesso')

		showModal.value = false
		await fetchMyCharacters()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isSubmitting.value = false
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
	Object.assign(characterForm, initialStateForm)

	characterImage.value = null
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
	<CharacterFormModal
		v-model:show="showModal"
		v-model:name="characterForm.name"
		v-model:description="characterForm.description"
		v-model:lore="characterForm.lore"
		v-model:game-system="characterForm.gameSystem"
		v-model:sheet="characterForm.sheet"
		v-model:image="characterImage"
		:image-url="existingImageUrl"
		:heading="editId === 0 ? 'Novo personagem' : 'Editar personagem'"
		:submit-label="editId === 0 ? 'Criar' : 'Editar'"
		:game-system-editable="editId === 0"
		:rules="rules"
		:loading="isSubmitting"
		@submit="handleFormSubmit"
		@after-leave="onCloseModal"
	/>

	<div>
		<div class="toolbar">
			<n-button
				type="primary"
				strong
				:focusable="false"
				@click.prevent="handleAddCharButton"
			>
				<template #icon>
					<n-icon>
						<IconAdd />
					</n-icon>
				</template>

				Crie um novo personagem
			</n-button>
		</div>

		<div class="empty__card" v-if="chars.length === 0 && !isLoading">
			<p>
				Você ainda não tem um personagem cadastrado
			</p>
		</div>

		<div class="center__container" v-else-if="isLoading">
			<n-spin size="large" />
		</div>

		<div v-else class="cards__wrapper">
			<CardPersonagem
				v-for="char in chars"
				:key="char.id"
				:char="char"
				@edit="handleEditChar"
				@delete="handleDeleteChar"
			/>
		</div>
	</div>
</template>

<style scoped>
.toolbar {
	display: flex;
	justify-content: flex-end;
	margin-bottom: var(--space-5);
}

.center__container {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;

	height: 300px;
}

.empty__card {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;

	height: 100px;

	border-radius: 8px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.empty__card > p {
	font-family: var(--font-sans);
	font-size: 0.85rem;
	color: var(--cor-granada);
}

.cards__wrapper {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
	gap: var(--space-5);
}
</style>

<script setup lang="ts">
import { deleteMyCharacter, getMyCharacters, updateMyCharacter } from '@/services/characters.service'
import { useAuthStore } from '@/stores/useAuth'
import { useDialog, useMessage } from 'naive-ui'
import { ref, reactive } from 'vue'
import type { CharactersResponse } from '@/types/charactersTypes'
import { NButton, NIcon, NSpin, NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { Add as IconAdd } from '@vicons/ionicons5'
import CardPersonagem from '@/components/CardPersonagem.vue'

const dialog = useDialog()
const message = useMessage()
const auth = useAuthStore()

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

function handleAddCharButton() {
	showModal.value = true
}

async function handleAddCharSubmit() {

}

function handleEditChar(charId: number) {
	const selectedChar = chars.value.find(item => item.id === charId)

	if (selectedChar) {
		characterForm.name = selectedChar.name
		characterForm.description = selectedChar.description
		characterForm.lore = selectedChar.lore

		showModal.value = true
		editId.value = charId
	}
}

async function handleEditCharSubmit() {
	try {
		isLoading.value = true

		const payload = {
			id: editId.value,
			...characterForm
		}

		await updateMyCharacter(payload)

		message.success('Personagem atualizado com sucesso')

		onCloseModal()
		fetchMyCharacters()
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

		fetchMyCharacters()
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
	editId.value = 0
}

async function fetchMyCharacters() {
	try {
		isLoading.value = true

		const myChars = await getMyCharacters(auth.user!.id)

		if (myChars.length > 0) {
			chars.value = myChars
		}
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
			<h2 class="modal__title">Novo personagem</h2>

			<n-form class="modal__form" label-placement="top" @submit.prevent="handleAddCharSubmit">
				<n-form-item label="Nome">
					<n-input v-model:value="characterForm.name" type="text" placeholder="Ex: Elyndra Corvain"></n-input>
				</n-form-item>

				<n-form-item label="Descrição">
					<n-input v-model:value="characterForm.description" type="textarea" placeholder="Aparência, personalidade, trejeitos... como alguém reconheceria seu personagem em um relance?" :autosize="{ minRows: 3, maxRows: 6 }"></n-input>
				</n-form-item>

				<n-form-item label="História">
					<n-input v-model:value="characterForm.lore" type="textarea" placeholder="De onde ele veio, o que já viveu, o que carrega consigo até aqui..." :autosize="{ minRows: 4, maxRows: 10 }"></n-input>
				</n-form-item>

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

		<div class="center__container" v-if="isLoading">
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
	max-width: 720px;
	padding: var(--space-6) var(--space-5);
	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	box-shadow: var(--shadow);
}

.modal__title {
	margin-bottom: var(--space-5);
}

.modal__form {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
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

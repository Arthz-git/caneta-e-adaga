<script setup lang="ts">
import { getMyCharacters } from '@/services/characters.service'
import { useAuthStore } from '@/stores/useAuth'
import { useMessage } from 'naive-ui'
import { ref, reactive } from 'vue'
import type { CharactersResponse } from '@/types/charactersTypes'
import { NButton, NIcon, NSpin, NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { Add as IconAdd } from '@vicons/ionicons5'

const message = useMessage()
const auth = useAuthStore()

const chars = ref<CharactersResponse[]>([])
const isLoading = ref(false)
const showModal = ref(false)

const initialStateForm = {
	name: '',
	description: '',
	lore: ''
}

const addCharForm = reactive({ ... initialStateForm })

function handleAddCharButton() {
	showModal.value = true
}

async function handleAddCharSubmit() {

}

async function fetchMyCharacters() {
	try {
		isLoading.value = true

		const myChars = await getMyCharacters(auth.user!.id)

		if (myChars.length) {
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
	<n-modal v-model:show="showModal">
		<div class="modal__container">
			<h2 class="modal__title">Novo personagem</h2>

			<n-form class="modal__form" label-placement="top" @submit.prevent="handleAddCharSubmit">
				<n-form-item label="Nome">
					<n-input v-model:value="addCharForm.name" type="text" placeholder="Ex: Elyndra Corvain"></n-input>
				</n-form-item>

				<n-form-item label="Descrição">
					<n-input v-model:value="addCharForm.description" type="textarea" placeholder="Aparência, personalidade, trejeitos... como alguém reconheceria seu personagem em um relance?" :autosize="{ minRows: 3, maxRows: 6 }"></n-input>
				</n-form-item>

				<n-form-item label="História">
					<n-input v-model:value="addCharForm.lore" type="textarea" placeholder="De onde ele veio, o que já viveu, o que carrega consigo até aqui..." :autosize="{ minRows: 4, maxRows: 10 }"></n-input>
				</n-form-item>

				<n-button type="primary" attr-type="submit" block strong>
					Criar
				</n-button>
			</n-form>
		</div>
	</n-modal>

	<div>
		<n-button
			@click="handleAddCharButton"
			:focusable="false"
			size="large"
		>
			<template #icon>
				<NIcon>
					<IconAdd />
				</NIcon>
			</template>

			Adicionar personagem
		</n-button>

		<div class="empty__card center__container" v-if="chars.length === 0 ? true : false">
			<p>
				Você ainda não tem um personagem cadastrado
			</p>
		</div>

		<div class="center__container" v-if="isLoading">
			<n-spin size="large" />
		</div>
	</div>
</template>

<style scoped>
.teste {
	font-family: var(--font-mono);
}
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

	margin-top: var(--space-6);
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
</style>

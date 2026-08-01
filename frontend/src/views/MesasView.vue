<script setup lang="ts">
import { getAllMesaPaginated, createMesa } from '@/services/mesas.service'
import { MesaResponse } from '@/types/mesaTypes'
import { ref, reactive, watch } from 'vue'
import {
	SearchOutline as IconSearch,
	Add as IconAdd
} from '@vicons/ionicons5'
import {
	NInput,
	NInputNumber,
	NSwitch,
	NIcon,
	NPagination,
	NSpin,
	NButton,
	NModal,
	NForm,
	NFormItem,
	useMessage
} from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/useAuth'
import CardMesa from '@/components/CardMesa.vue'

const message = useMessage()
const auth = useAuthStore()

const LIMIT = 9
const SEARCH_DEBOUNCE_MS = 400

const initialForm = {
	title: '',
	description: '',
	isPrivate: false,
	allowSpectators: true,
	maxPlayers: 4
}

const addMesaForm = reactive({ ...initialForm })
const addMesaFormRef = ref<FormInst | null>(null)

const addMesaRules: FormRules = {
	title: [
		{
			required: true,
			message: 'Título é um campo obrigatório',
			trigger: ['input', 'blur']
		},
		{
			min: 2,
			max: 100,
			message: 'O título deve ter entre 2 e 100 caracteres',
			trigger: ['input', 'blur']
		}
	],
	description: [
		{
			required: true,
			message: 'Descrição é um campo obrigatório',
			trigger: ['input', 'blur']
		},
		{
			min: 2,
			max: 400,
			message: 'A descrição deve ter entre 2 e 400 caracteres',
			trigger: ['input', 'blur']
		}
	],
	maxPlayers: {
		required: true,
		type: 'number',
		min: 1,
		max: 8,
		message: 'O máximo de jogadores deve ser um número entre 1 e 8',
		trigger: ['input', 'blur', 'change']
	}
}

const mesas = ref<MesaResponse[]>([])
const searchMesa = ref('')
const page = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)

function handleAddMesaButton() {
	showModal.value = true
}

async function handleAddMesaSubmit() {
	try {
		await addMesaFormRef.value?.validate()

		isSubmitting.value = true

		await createMesa({ ...addMesaForm })

		message.success('Mesa criada com sucesso')

		onCloseModal()

		if (page.value === 1) {
			fetchMesas()
		}
		else {
			page.value = 1
		}
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isSubmitting.value = false
	}
}

function onCloseModal() {
	showModal.value = false
	Object.assign(addMesaForm, initialForm)
}

let searchTimeout: ReturnType<typeof setTimeout>

async function fetchMesas() {
	try {
		isLoading.value = true

		const mesasResponse = await getAllMesaPaginated({
			page: page.value,
			limit: LIMIT,
			search: searchMesa.value || undefined
		})

		mesas.value = mesasResponse.data
		totalPages.value = mesasResponse.meta.totalPages
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

watch(page, fetchMesas)

watch(searchMesa, () => {
	clearTimeout(searchTimeout)

	searchTimeout = setTimeout(() => {
		page.value = 1
		fetchMesas()
	}, SEARCH_DEBOUNCE_MS)
})

fetchMesas()
</script>

<template>
	<n-modal v-model:show="showModal" :on-after-leave="onCloseModal">
		<div class="modal__container">
			<h2 class="modal__title">Crie uma nova mesa</h2>

			<n-form ref="addMesaFormRef" :model="addMesaForm" :rules="addMesaRules" class="modal__form" label-placement="top" @submit.prevent="handleAddMesaSubmit">
				<n-form-item label="Título" path="title">
					<n-input v-model:value="addMesaForm.title" type="text" placeholder="Ex: A Torre Esquecida"></n-input>
				</n-form-item>

				<n-form-item label="Descrição" path="description">
					<n-input
						v-model:value="addMesaForm.description"
						type="textarea"
						placeholder="Do que se trata essa mesa?"
						:autosize="{ minRows: 6, maxRows: 12 }"
						:rows="6"
					></n-input>
				</n-form-item>

				<n-form-item label="Máximo de jogadores" path="maxPlayers">
					<n-input-number v-model:value="addMesaForm.maxPlayers" :min="1" :max="8" class="modal__number" />
				</n-form-item>

				<div class="modal__switches">
					<n-form-item label="Mesa privada" style="width: 50%;">
						<n-switch v-model:value="addMesaForm.isPrivate" />
					</n-form-item>

					<n-form-item label="Permitir espectadores">
						<n-switch v-model:value="addMesaForm.allowSpectators" />
					</n-form-item>
				</div>

				<n-button
					type="primary"
					attr-type="submit"
					block
					strong
					:loading="isSubmitting"
					:disabled="isSubmitting"
					:focusable="false"
				>
					Criar
				</n-button>
			</n-form>
		</div>
	</n-modal>

	<div>
		<div class="toolbar">
			<n-input class="toolbar__search" v-model:value="searchMesa" type="text" placeholder="Procurar mesa">
				<template #prefix>
					<n-icon :component="IconSearch" />
				</template>
			</n-input>

			<n-button
				type="primary"
				strong
				@click.prevent="handleAddMesaButton"
				:focusable="false"
			>
				<template #icon>
					<n-icon>
						<IconAdd />
					</n-icon>
				</template>

				Crie uma nova mesa
			</n-button>
		</div>

		<div class="empty__card" v-if="mesas.length === 0 ? true : false">
			<p>
				Não há nenhuma mesa para exibir
			</p>
		</div>
		
		<div
			class="center__container"
			v-if="isLoading"
		>
			<n-spin size="large" />
		</div>

		<div v-else>
			<div class="cards__wrapper">
				<CardMesa
					v-for="mesa in mesas"
					:key="mesa.id"
					:mesa="mesa"
					:is-owner="mesa.creator.id === auth.user!.id"
				/>
			</div>

			<n-pagination v-if="totalPages > 1" v-model:page="page" :page-count="totalPages" class="pagination" />
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

.toolbar {
	display: flex;
	align-items: center;
	gap: var(--space-4);
}

.toolbar__search {
	flex: 1;
}

.modal__number {
	width: 120px;
}

.modal__switches {
	display: flex;
}

.cards__wrapper {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
	gap: var(--space-5);

	margin-top: var(--space-6);
}

.pagination {
	display: flex;
	justify-content: center;
	margin-top: var(--space-6);
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

	margin-top: var(--space-6);

	
	border-radius: 8px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.empty__card > p {
	font-family: var(--font-sans);
	font-size: 0.85rem;
	color: var(--cor-granada);
}
</style>

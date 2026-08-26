<script setup lang="ts">
import { getAllMesaPaginated, createMesa } from '@/services/mesas.service'
import { MesaResponse, type GameSystem } from '@/types/mesaTypes'
import { ref, reactive, watch } from 'vue'
import {
	SearchOutline as IconSearch,
	Add as IconAdd
} from '@vicons/ionicons5'
import {
	NInput,
	NIcon,
	NPagination,
	NSpin,
	NButton,
	useMessage
} from 'naive-ui'
import type { FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/useAuth'
import CardMesa from '@/components/CardMesa.vue'
import ViewMesaModal from '@/components/ViewMesaModal.vue'
import MesaFormModal from '@/components/MesaFormModal.vue'

const message = useMessage()
const auth = useAuthStore()

const LIMIT = 9
const SEARCH_DEBOUNCE_MS = 400

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
	gameSystem: {
		required: true,
		message: 'Sistema de jogo é um campo obrigatório',
		trigger: ['change', 'blur']
	},
	maxPlayers: {
		required: true,
		type: 'number',
		min: 1,
		max: 8,
		message: 'O máximo de jogadores deve ser um número entre 1 e 8',
		trigger: ['input', 'blur', 'change']
	}
}

const initialForm = {
	title: '',
	description: '',
	gameSystem: null as GameSystem | null,
	isPrivate: false,
	allowSpectators: true,
	maxPlayers: 4
}

const addMesaForm = reactive({ ...initialForm })
const addMesaImage = ref<File | null>(null)
const mesas = ref<MesaResponse[]>([])
const searchMesa = ref('')
const mineOnly = ref(false)
const page = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const isSubmitting = ref(false)
const showAddMesamodal = ref(false)
const showViewMesaModal = ref(false)
const viewMesa = ref<MesaResponse | null>(null)

function handleAddMesaButton() {
	showAddMesamodal.value = true
}

async function handleAddMesaSubmit() {
	try {
		isSubmitting.value = true

		await createMesa({ ...addMesaForm, gameSystem: addMesaForm.gameSystem!, image: addMesaImage.value ?? undefined })

		message.success('Mesa criada com sucesso')

		onCloseAddMesaModal()

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

function onCloseAddMesaModal() {
	Object.assign(addMesaForm, initialForm)
	addMesaImage.value = null
}

function onCardClick(mesaId: number) {
	showViewMesaModal.value = true
	const mesa = mesas.value.find(item => item.id === mesaId)

	if (mesa) {
		viewMesa.value = mesa
	}
}

let searchTimeout: ReturnType<typeof setTimeout>

async function fetchMesas() {
	try {
		isLoading.value = true

		const mesasResponse = await getAllMesaPaginated({
			page: page.value,
			limit: LIMIT,
			search: searchMesa.value || undefined,
			mine: mineOnly.value || undefined
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

watch(mineOnly, () => {
	page.value = 1
	fetchMesas()
})

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
	<MesaFormModal
		v-model:show="showAddMesamodal"
		v-model:title="addMesaForm.title"
		v-model:description="addMesaForm.description"
		v-model:game-system="addMesaForm.gameSystem"
		v-model:max-players="addMesaForm.maxPlayers"
		v-model:is-private="addMesaForm.isPrivate"
		v-model:allow-spectators="addMesaForm.allowSpectators"
		v-model:image="addMesaImage"
		heading="Crie uma nova mesa"
		submit-label="Criar"
		show-game-system
		:rules="addMesaRules"
		:loading="isSubmitting"
		@submit="handleAddMesaSubmit"
		@after-leave="onCloseAddMesaModal"
	/>

	<ViewMesaModal
		v-model:show="showViewMesaModal"
		:mesa="viewMesa"
	/>

	<div>
		<div class="toolbar">
			<n-input class="toolbar__search" v-model:value="searchMesa" type="text" placeholder="Procurar mesa">
				<template #prefix>
					<n-icon :component="IconSearch" />
				</template>
			</n-input>

			<n-button
				:type="mineOnly ? 'primary' : 'default'"
				:secondary="!mineOnly"
				strong
				@click.prevent="mineOnly = !mineOnly"
				:focusable="true"
			>
				Minhas mesas
			</n-button>

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
					:onCardClick="() => onCardClick(mesa.id)"
				/>
			</div>

			<n-pagination
				v-if="totalPages > 1"
				v-model:page="page"
				:page-count="totalPages"
				class="pagination"
			/>
		</div>
	</div>
</template>

<style scoped>
.toolbar {
	display: flex;
	align-items: center;
	gap: var(--space-4);
}

.toolbar__search {
	flex: 1;
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

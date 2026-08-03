<script setup lang="ts">
import { getAllMesaPaginated, createMesa } from '@/services/mesas.service'
import { MesaResponse } from '@/types/mesaTypes'
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import {
	SearchOutline as IconSearch,
	Add as IconAdd,
	ImageOutline as IconImage,
	CloseOutline as IconClose,
	PeopleOutline as IconUsers,
	EyeOutline as IconEye,
	LockClosedOutline as IconLocked,
	LockOpenOutline as IconUnlocked,
	CalendarOutline as IconCalendar
} from '@vicons/ionicons5'
import { formatDateIntoString } from '@/composables/transformDateIntoString'
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
	NUpload,
	useMessage
} from 'naive-ui'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import { useAuthStore } from '@/stores/useAuth'
import CardMesa from '@/components/CardMesa.vue'

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
	isPrivate: false,
	allowSpectators: true,
	maxPlayers: 4
}

const addMesaForm = reactive({ ...initialForm })
const addMesaFormRef = ref<FormInst | null>(null)
const addMesaImage = ref<File | null>(null)
const addMesaImagePreview = ref<string | null>(null)
const mesas = ref<MesaResponse[]>([])
const searchMesa = ref('')
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
		await addMesaFormRef.value?.validate()

		isSubmitting.value = true

		await createMesa({ ...addMesaForm, image: addMesaImage.value ?? undefined })

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
	showAddMesamodal.value = false
	Object.assign(addMesaForm, initialForm)

	if (addMesaImagePreview.value) {
		URL.revokeObjectURL(addMesaImagePreview.value)
	}

	addMesaImage.value = null
	addMesaImagePreview.value = null
}

function onCardClick(mesaId: number) {
	showViewMesaModal.value = true
	const mesa = mesas.value.find(item => item.id === mesaId)

	if (mesa) {
		viewMesa.value = mesa
	}
}

function onCloseViewMesaModal() {}

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

function handleImageChange({ file }: { file: UploadFileInfo }) {
	addMesaImage.value = file.file ?? null

	if (addMesaImagePreview.value) {
		URL.revokeObjectURL(addMesaImagePreview.value)
	}

	addMesaImagePreview.value = addMesaImage.value ? URL.createObjectURL(addMesaImage.value) : null
}

onBeforeUnmount(() => {
	if (addMesaImagePreview.value) {
		URL.revokeObjectURL(addMesaImagePreview.value)
	}
})

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
	<n-modal v-model:show="showAddMesamodal" :on-after-leave="onCloseAddMesaModal">
		<div class="modal__container">
			<div class="modal__header">
				<h2 class="modal__title">Crie uma nova mesa</h2>

				<n-button quaternary circle :focusable="false" @click="showAddMesamodal = false">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<n-form ref="addMesaFormRef" :model="addMesaForm" :rules="addMesaRules" class="modal__form" label-placement="top" @submit.prevent="handleAddMesaSubmit">
				<div class="modal__form-body">
					<div class="modal__image">
						<n-upload
							accept="image/*"
							:show-file-list="false"
							:default-upload="false"
							@change="handleImageChange"
						>
							<div class="modal__image-preview">
								<img v-if="addMesaImagePreview" :src="addMesaImagePreview" alt="Prévia da mesa" class="modal__image-img">
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
						<n-form-item label="Título" path="title">
							<n-input v-model:value="addMesaForm.title" type="text" placeholder="Ex: A Torre Esquecida"></n-input>
						</n-form-item>

						<n-form-item label="Descrição" path="description">
							<n-input
								v-model:value="addMesaForm.description"
								type="textarea"
								placeholder="Do que se trata essa mesa?"
								:autosize="{ minRows: 8, maxRows: 12 }"
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
					</div>
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

	<n-modal
		v-model:show="showViewMesaModal" :on-after-leave="onCloseViewMesaModal"
	>
		<div class="modal__container view__container" v-if="viewMesa">
			<div class="modal__header">
				<h2 class="modal__title">{{ viewMesa.title }}</h2>

				<n-button quaternary circle :focusable="false" @click="showViewMesaModal = false">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<div class="view__body">
				<div class="view__image">
					<img v-if="viewMesa.imageUrl" :src="viewMesa.imageUrl" :alt="viewMesa.title" class="view__image-img">
					<div v-else class="view__image-placeholder">
						<n-icon size="48">
							<IconImage />
						</n-icon>
					</div>
				</div>

				<div class="view__fields">
					<div class="view__field">
						<span class="view__label">Descrição</span>
						<p class="view__description">{{ viewMesa.description }}</p>
					</div>

					<div class="view__field">
						<span class="view__label">Criador</span>
						<p>{{ viewMesa.creator.name }}</p>
					</div>

					<div class="view__info">
						<div class="info__item">
							<n-icon>
								<IconUsers />
							</n-icon>
							<span>{{ viewMesa.countPlayers }}/{{ viewMesa.maxPlayers }} jogadores</span>
						</div>

						<div class="info__item" v-if="viewMesa.allowSpectators">
							<n-icon>
								<IconEye />
							</n-icon>
							<span>{{ viewMesa.countSpectators }} espectadores</span>
						</div>

						<div class="info__item">
							<n-icon>
								<IconLocked v-if="viewMesa.isPrivate" />
								<IconUnlocked v-else />
							</n-icon>
							<span>{{ viewMesa.isPrivate ? 'Mesa privada' : 'Mesa pública' }}</span>
						</div>

						<div class="info__item">
							<n-icon>
								<IconCalendar />
							</n-icon>
							<span>Criada em {{ formatDateIntoString(viewMesa.createdAt) }}</span>
						</div>
					</div>
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
					{{ viewMesa.isPrivate ? 'Solicitar entrada' : 'Entrar' }}
				</n-button>
			</div>
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
					:onCardClick="() => onCardClick(mesa.id)"
				/>
			</div>

			<n-pagination v-if="totalPages > 1" v-model:page="page" :page-count="totalPages" class="pagination" />
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
		grid-template-columns: 360px 1fr;
		gap: var(--space-6);
		justify-items: initial;
	}
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

.view__container {
	max-width: 640px;
}

.view__body {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.view__image {
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: 12px;
	overflow: hidden;
	border: 1px solid var(--cor-linha);
	background: var(--cor-papel);
}

.view__image-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.view__image-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--cor-tinta-fraca);
}

.view__fields {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.view__field {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.view__label {
	font-family: var(--font-sans);
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	color: var(--cor-tinta-fraca);
}

.view__description {
	font-family: var(--font-serif);
	font-style: italic;
	color: var(--cor-tinta);
	font-size: 1rem;
	max-height: 240px;
	overflow: auto;
}

.view__info {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-4);
}

.info__item {
	display: flex;
	align-items: center;
	gap: var(--space-1);

	font-family: var(--font-sans);
	font-size: 0.75rem;
	color: var(--cor-tinta-fraca);
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

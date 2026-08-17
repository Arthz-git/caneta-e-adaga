<script setup lang="ts">
import { ref, watch } from 'vue'
import { NButton, NEmpty, NIcon, NInput, NInputNumber, NModal, NSpin, NTabPane, NTabs, useMessage } from 'naive-ui'
import { CloseOutline as IconClose, PersonAddOutline as IconSend } from '@vicons/ionicons5'
import { createSolicitacaoMesa } from '@/services/solicitacao.service'
import { getUserById, searchUsersByName } from '@/services/users.service'
import type { UserSearchResult } from '@/types/userSearchTypes'

const props = defineProps<{
	show: boolean
}>()

const emit = defineEmits<{
	'update:show': [value: boolean]
}>()

const message = useMessage()

const tab = ref<'id' | 'nome'>('id')
const isSubmitting = ref(false)

const idValue = ref<number | null>(null)
const idUser = ref<UserSearchResult | null>(null)
const isSearchingId = ref(false)
let idTimeout: ReturnType<typeof setTimeout> | undefined

const nameQuery = ref('')
const searchResults = ref<UserSearchResult[]>([])
const selectedUser = ref<UserSearchResult | null>(null)
const isSearching = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | undefined

function close() {
	emit('update:show', false)
}

function resetState() {
	tab.value = 'id'
	idValue.value = null
	idUser.value = null
	nameQuery.value = ''
	searchResults.value = []
	selectedUser.value = null
}

watch(() => props.show, (show) => {
	if (!show) resetState()
})

watch(idValue, (value) => {
	idUser.value = null
	clearTimeout(idTimeout)

	if (!value) {
		isSearchingId.value = false
		return
	}

	isSearchingId.value = true
	idTimeout = setTimeout(async () => {
		try {
			idUser.value = await getUserById(value)
		}
		catch {
			idUser.value = null
		}
		finally {
			isSearchingId.value = false
		}
	}, 400)
})

watch(nameQuery, (value) => {
	selectedUser.value = null
	clearTimeout(searchTimeout)

	const query = value.trim()
	if (!query) {
		searchResults.value = []
		isSearching.value = false
		return
	}

	isSearching.value = true
	searchTimeout = setTimeout(async () => {
		try {
			searchResults.value = await searchUsersByName(query)
		}
		catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Não foi possível buscar usuários.'
			message.error(errorMessage)
		}
		finally {
			isSearching.value = false
		}
	}, 400)
})

function selectUser(user: UserSearchResult) {
	selectedUser.value = user
}

async function handleSubmit() {
	const destinoId = tab.value === 'id' ? idUser.value?.id : selectedUser.value?.id

	if (!destinoId) return

	try {
		isSubmitting.value = true

		await createSolicitacaoMesa({
			destinoId,
			motivo: 'PEDIDO_AMIZADE'
		})

		message.success('Solicitação de amizade enviada')
		close()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível enviar a solicitação.'
		message.error(errorMessage)
	}
	finally {
		isSubmitting.value = false
	}
}

const canSubmit = () => tab.value === 'id' ? !!idUser.value : !!selectedUser.value
</script>

<template>
	<n-modal :show="props.show" @update:show="value => emit('update:show', value)">
		<div class="modal__container">
			<div class="modal__header">
				<h2 class="modal__title">
					Adicionar amigo
				</h2>

				<n-button quaternary circle :focusable="false" @click="close">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<n-tabs v-model:value="tab" type="line" animated>
				<n-tab-pane name="id" tab="Por ID">
					<div class="tab__content">
						<n-input-number
							v-model:value="idValue"
							placeholder="Id do usuário"
							:min="1"
							:show-button="false"
							clearable
							class="tab__input"
						/>

						<div v-if="isSearchingId" class="search__center">
							<n-spin size="small" />
						</div>

						<n-empty
							v-else-if="idValue && !idUser"
							description="Nenhum usuário encontrado com esse id"
							size="small"
							class="search__center"
						/>

						<div v-else-if="idUser" class="search__item search__item--selected">
							{{ idUser.name }}
						</div>
					</div>
				</n-tab-pane>

				<n-tab-pane name="nome" tab="Por nome">
					<div class="tab__content">
						<n-input
							v-model:value="nameQuery"
							placeholder="Digite o nome do usuário"
							clearable
						/>

						<div v-if="isSearching" class="search__center">
							<n-spin size="small" />
						</div>

						<n-empty
							v-else-if="nameQuery.trim() && !searchResults.length"
							description="Nenhum usuário encontrado"
							size="small"
							class="search__center"
						/>

						<div v-else-if="searchResults.length" class="search__list">
							<button
								v-for="user of searchResults"
								:key="user.id"
								type="button"
								class="search__item"
								:class="{ 'search__item--selected': selectedUser?.id === user.id }"
								@click="selectUser(user)"
							>
								{{ user.name }}
							</button>
						</div>
					</div>
				</n-tab-pane>
			</n-tabs>

			<n-button
				type="primary"
				block
				strong
				:disabled="!canSubmit()"
				:loading="isSubmitting"
				:focusable="false"
				class="submit__button"
				@click="handleSubmit"
			>
				<template #icon>
					<n-icon>
						<IconSend />
					</n-icon>
				</template>
				Enviar solicitação
			</n-button>
		</div>
	</n-modal>
</template>

<style scoped>
.modal__container {
	width: 90vw;
	max-width: 420px;
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

.tab__content {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
	padding-top: var(--space-3);
	min-height: 160px;
}

.tab__input {
	width: 100%;
}

.search__center {
	display: flex;
	justify-content: center;
	padding: var(--space-4) 0;
}

.search__list {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	max-height: 220px;
	overflow-y: auto;
}

.search__item {
	text-align: left;
	padding: var(--space-2) var(--space-3);
	border-radius: 8px;
	border: 1px solid var(--cor-linha);
	background: var(--cor-papel);
	color: var(--cor-tinta);
	font-family: var(--font-sans);
	font-size: 0.9rem;
	cursor: pointer;
	transition: border-color 0.15s ease, background-color 0.15s ease;
}

.search__item:hover {
	border-color: var(--cor-granada);
}

.search__item--selected {
	border-color: var(--cor-granada);
	background: var(--cor-linha);
}

.submit__button {
	margin-top: var(--space-5);
}
</style>

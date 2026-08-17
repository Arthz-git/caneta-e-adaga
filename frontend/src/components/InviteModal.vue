<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NButton, NEmpty, NIcon, NInput, NInputNumber, NModal, NSpin, NTabPane, NTabs, useMessage } from 'naive-ui'
import { CloseOutline as IconClose, PersonOutline as IconPerson } from '@vicons/ionicons5'
import { getAllAmizades } from '@/services/amizade.service'
import { createSolicitacaoMesa, getMySolicitacaoByMesaId } from '@/services/solicitacao.service'
import { getUserById, searchUsersByName } from '@/services/users.service'
import type { AmizadeResponse } from '@/types/amizadeTypes'
import type { UserSearchResult } from '@/types/userSearchTypes'
import { useAuthStore } from '@/stores/useAuth'

const props = defineProps<{
	show: boolean
	mesaId: number
	excludedUserIds?: number[]
}>()

const emit = defineEmits<{
	'update:show': [value: boolean]
}>()

const message = useMessage()
const auth = useAuthStore()

const tab = ref<'amigos' | 'id' | 'nome'>('amigos')

const isLoading = ref(false)
const amizades = ref<AmizadeResponse[]>([])
const pendingInviteUserIds = ref<Set<number>>(new Set())
const invitingUserId = ref<number | null>(null)

const idValue = ref<number | null>(null)
const idUser = ref<UserSearchResult | null>(null)
const isSearchingId = ref(false)
let idTimeout: ReturnType<typeof setTimeout> | undefined

const nameQuery = ref('')
const searchResults = ref<UserSearchResult[]>([])
const isSearching = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | undefined

function amigo(amizade: AmizadeResponse) {
	return amizade.userA.id === auth.user?.id ? amizade.userB : amizade.userA
}

const excludedIds = computed(() => new Set(props.excludedUserIds ?? []))

const friends = computed(() => amizades.value.filter(amizade => !excludedIds.value.has(amigo(amizade).id)))

const isEmpty = computed(() => !isLoading.value && !friends.value.length)

function close() {
	emit('update:show', false)
}

function resetSearchState() {
	tab.value = 'amigos'
	idValue.value = null
	idUser.value = null
	nameQuery.value = ''
	searchResults.value = []
}

async function fetchData() {
	try {
		isLoading.value = true

		const [amizadesResult, solicitacoes] = await Promise.all([
			getAllAmizades({ page: 1, limit: 50 }),
			getMySolicitacaoByMesaId(props.mesaId)
		])

		amizades.value = amizadesResult.data
		pendingInviteUserIds.value = new Set(
			solicitacoes
				.filter(s => s.motivo === 'CONVITE_MESA' && s.status === 'PENDENTE')
				.map(s => s.destino.id)
		)
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar os amigos.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

watch(() => props.show, (show) => {
	if (show) {
		fetchData()
	}
	else {
		resetSearchState()
	}
}, { immediate: true })

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

function isExcluded(userId: number) {
	return excludedIds.value.has(userId) || userId === auth.user?.id
}

async function handleInvite(userId: number) {
	if (invitingUserId.value) return

	try {
		invitingUserId.value = userId

		await createSolicitacaoMesa({
			mesaId: props.mesaId,
			destinoId: userId,
			motivo: 'CONVITE_MESA'
		})

		pendingInviteUserIds.value.add(userId)
		message.success('Convite enviado')
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível enviar o convite.'
		message.error(errorMessage)
	}
	finally {
		invitingUserId.value = null
	}
}
</script>

<template>
	<n-modal :show="props.show" @update:show="value => emit('update:show', value)">
		<div class="modal__container">
			<div class="modal__header">
				<h2 class="modal__title">
					Convidar para a mesa
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
				<n-tab-pane name="amigos" tab="Amigos">
					<div v-if="isLoading" class="center__container">
						<n-spin size="large" />
					</div>

					<n-empty
						v-else-if="isEmpty"
						description="Nenhum amigo disponível para convidar"
						class="center__container"
					/>

					<div v-else class="list">
						<div v-for="amizade of friends" :key="amizade.id" class="friend-row">
							<div class="friend-row__info">
								<div class="friend-row__avatar">
									<n-icon>
										<IconPerson />
									</n-icon>
								</div>

								<span class="friend-row__nome">{{ amigo(amizade).name }}</span>
							</div>

							<n-button
								size="small"
								type="primary"
								secondary
								:disabled="pendingInviteUserIds.has(amigo(amizade).id)"
								:loading="invitingUserId === amigo(amizade).id"
								:focusable="false"
								@click="handleInvite(amigo(amizade).id)"
							>
								{{ pendingInviteUserIds.has(amigo(amizade).id) ? 'Convite pendente' : 'Convidar' }}
							</n-button>
						</div>
					</div>
				</n-tab-pane>

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

						<div v-else-if="idUser" class="friend-row">
							<div class="friend-row__info">
								<div class="friend-row__avatar">
									<n-icon>
										<IconPerson />
									</n-icon>
								</div>

								<span class="friend-row__nome">{{ idUser.name }}</span>
							</div>

							<n-button
								size="small"
								type="primary"
								secondary
								:disabled="isExcluded(idUser.id) || pendingInviteUserIds.has(idUser.id)"
								:loading="invitingUserId === idUser.id"
								:focusable="false"
								@click="handleInvite(idUser.id)"
							>
								{{ pendingInviteUserIds.has(idUser.id) ? 'Convite pendente' : 'Convidar' }}
							</n-button>
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

						<div v-else-if="searchResults.length" class="list">
							<div v-for="user of searchResults" :key="user.id" class="friend-row">
								<div class="friend-row__info">
									<div class="friend-row__avatar">
										<n-icon>
											<IconPerson />
										</n-icon>
									</div>

									<span class="friend-row__nome">{{ user.name }}</span>
								</div>

								<n-button
									size="small"
									type="primary"
									secondary
									:disabled="isExcluded(user.id) || pendingInviteUserIds.has(user.id)"
									:loading="invitingUserId === user.id"
									:focusable="false"
									@click="handleInvite(user.id)"
								>
									{{ pendingInviteUserIds.has(user.id) ? 'Convite pendente' : 'Convidar' }}
								</n-button>
							</div>
						</div>
					</div>
				</n-tab-pane>
			</n-tabs>
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

.center__container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 160px;
}

.search__center {
	display: flex;
	justify-content: center;
	padding: var(--space-4) 0;
}

.list {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	max-height: 400px;
	overflow-y: auto;
	padding-top: var(--space-3);
}

.friend-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-3);

	padding: var(--space-2) var(--space-3);
	border-radius: 10px;
	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
}

.friend-row__info {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	min-width: 0;
}

.friend-row__avatar {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	height: 32px;
	width: 32px;

	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 50%;
	color: var(--cor-tinta-fraca);
	font-size: 0.9rem;
}

.friend-row__nome {
	font-family: var(--font-sans);
	font-size: 0.9rem;
	color: var(--cor-tinta);

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>

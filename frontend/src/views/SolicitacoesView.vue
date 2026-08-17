<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NAvatar, NButton, NEmpty, NIcon, NPagination, NSelect, NSpin, NTabs, NTabPane, NTag, useDialog, useMessage } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import {
	CheckmarkOutline as IconAccept,
	CloseOutline as IconReject,
	TrashOutline as IconDelete,
	BanOutline as IconCancel
} from '@vicons/ionicons5'
import {
	cancelarSolicitacao,
	deleteSolicitacao,
	getAllSolicitacaoEnviadas,
	getAllSolicitacaoRecebidas,
	responderSolicitacao
} from '@/services/solicitacao.service'
import type { Motivos, SolicitacaoResponse, Status } from '@/types/solicitacaoTypes'
import { formatDateIntoString } from '@/composables/transformDateIntoString'

const LIMIT = 10

const dialog = useDialog()
const message = useMessage()

const tab = ref<'recebidas' | 'enviadas'>('recebidas')
const page = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const solicitacoes = ref<SolicitacaoResponse[]>([])
const statusFilter = ref<Status | null>(null)
const motivoFilter = ref<Motivos | null>(null)
const processingId = ref<number | null>(null)

const statusOptions: SelectOption[] = [
	{ label: 'Pendente', value: 'PENDENTE' },
	{ label: 'Aceita', value: 'ACEITA' },
	{ label: 'Recusada', value: 'RECUSADA' },
	{ label: 'Cancelada', value: 'CANCELADA' }
]

const motivoOptions: SelectOption[] = [
	{ label: 'Pedido de amizade', value: 'PEDIDO_AMIZADE' },
	{ label: 'Convite para mesa', value: 'CONVITE_MESA' },
	{ label: 'Pedido de entrada como jogador', value: 'PEDIDO_ENTRADA_MESA_JOGADOR' },
	{ label: 'Pedido de entrada como espectador', value: 'PEDIDO_ENTRADA_MESA_ESPECTADOR' }
]

const motivoLabels: Record<Motivos, string> = {
	PEDIDO_AMIZADE: 'Pedido de amizade',
	CONVITE_MESA: 'Convite para mesa',
	PEDIDO_ENTRADA_MESA_JOGADOR: 'Pedido de entrada como jogador',
	PEDIDO_ENTRADA_MESA_ESPECTADOR: 'Pedido de entrada como espectador'
}

const statusTagType: Record<Status, 'warning' | 'success' | 'error' | 'default'> = {
	PENDENTE: 'warning',
	ACEITA: 'success',
	RECUSADA: 'error',
	CANCELADA: 'default'
}

const statusLabels: Record<Status, string> = {
	PENDENTE: 'Pendente',
	ACEITA: 'Aceita',
	RECUSADA: 'Recusada',
	CANCELADA: 'Cancelada'
}

const isRecebidas = computed(() => tab.value === 'recebidas')

function outroParticipante(solicitacao: SolicitacaoResponse) {
	return isRecebidas.value ? solicitacao.solicitante : solicitacao.destino
}

function iniciais(nome: string) {
	return nome
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map(parte => parte[0]?.toUpperCase())
		.join('')
}

async function fetchSolicitacoes() {
	try {
		isLoading.value = true

		const params = {
			page: page.value,
			limit: LIMIT,
			status: statusFilter.value ?? undefined,
			motivo: motivoFilter.value ?? undefined
		}

		const result = isRecebidas.value
			? await getAllSolicitacaoRecebidas(params)
			: await getAllSolicitacaoEnviadas(params)

		solicitacoes.value = result.data
		totalPages.value = result.meta.totalPages
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar as solicitações.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

watch(tab, () => {
	page.value = 1
	fetchSolicitacoes()
})

watch(page, fetchSolicitacoes)

watch([statusFilter, motivoFilter], () => {
	page.value = 1
	fetchSolicitacoes()
})

async function handleResponder(solicitacao: SolicitacaoResponse, status: 'ACEITA' | 'RECUSADA') {
	try {
		processingId.value = solicitacao.id

		await responderSolicitacao(solicitacao.id, status)

		message.success(status === 'ACEITA' ? 'Solicitação aceita' : 'Solicitação recusada')

		await fetchSolicitacoes()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível responder a solicitação.'
		message.error(errorMessage)
	}
	finally {
		processingId.value = null
	}
}

function handleCancelar(solicitacao: SolicitacaoResponse) {
	dialog.warning({
		title: 'Cancelar solicitação',
		content: 'Tem certeza que deseja cancelar esta solicitação?',
		positiveText: 'Cancelar solicitação',
		negativeText: 'Voltar',
		onPositiveClick: async () => {
			try {
				processingId.value = solicitacao.id

				await cancelarSolicitacao(solicitacao.id)

				message.success('Solicitação cancelada')

				await fetchSolicitacoes()
			}
			catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Não foi possível cancelar a solicitação.'
				message.error(errorMessage)
			}
			finally {
				processingId.value = null
			}
		}
	})
}

function handleExcluir(solicitacao: SolicitacaoResponse) {
	dialog.warning({
		title: 'Excluir solicitação',
		content: 'Essa ação não pode ser desfeita. Deseja continuar?',
		positiveText: 'Excluir',
		negativeText: 'Cancelar',
		onPositiveClick: async () => {
			try {
				processingId.value = solicitacao.id

				await deleteSolicitacao(solicitacao.id)

				message.success('Solicitação excluída')

				await fetchSolicitacoes()
			}
			catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Não foi possível excluir a solicitação.'
				message.error(errorMessage)
			}
			finally {
				processingId.value = null
			}
		}
	})
}

fetchSolicitacoes()
</script>

<template>
	<div>
		<n-tabs v-model:value="tab" type="line" animated>
			<n-tab-pane name="recebidas" tab="Recebidas" />
			<n-tab-pane name="enviadas" tab="Enviadas" />
		</n-tabs>

		<div class="toolbar">
			<n-select
				v-model:value="statusFilter"
				:options="statusOptions"
				placeholder="Todos os status"
				clearable
				class="toolbar__filter"
			/>

			<n-select
				v-model:value="motivoFilter"
				:options="motivoOptions"
				placeholder="Todos os motivos"
				clearable
				class="toolbar__filter"
			/>
		</div>

		<div v-if="isLoading" class="center__container">
			<n-spin size="large" />
		</div>

		<n-empty
			v-else-if="!solicitacoes.length"
			description="Nenhuma solicitação para exibir"
			class="center__container"
		/>

		<div v-else class="list">
			<div v-for="solicitacao of solicitacoes" :key="solicitacao.id" class="solicitacao-row">
				<div class="solicitacao-row__info">
					<n-avatar round size="small" class="solicitacao-row__avatar">
						{{ iniciais(outroParticipante(solicitacao).name) }}
					</n-avatar>

					<div class="solicitacao-row__textos">
						<div class="solicitacao-row__header">
							<span class="solicitacao-row__pessoa">{{ outroParticipante(solicitacao).name }}</span>
							<n-tag :type="statusTagType[solicitacao.status]" size="small" round>
								{{ statusLabels[solicitacao.status] }}
							</n-tag>
						</div>

						<span class="solicitacao-row__motivo">{{ motivoLabels[solicitacao.motivo] }}</span>

						<span v-if="solicitacao.mesa" class="solicitacao-row__mesa">Mesa: {{ solicitacao.mesa.title }}</span>

						<span class="solicitacao-row__time">{{ formatDateIntoString(solicitacao.createdAt) }}</span>
					</div>
				</div>

				<div class="solicitacao-row__actions">
					<template v-if="solicitacao.status === 'PENDENTE' && isRecebidas">
						<n-button
							type="primary"
							size="small"
							secondary
							:loading="processingId === solicitacao.id"
							:focusable="false"
							@click="handleResponder(solicitacao, 'ACEITA')"
						>
							<template #icon>
								<n-icon>
									<IconAccept />
								</n-icon>
							</template>
							Aceitar
						</n-button>

						<n-button
							type="error"
							size="small"
							secondary
							:loading="processingId === solicitacao.id"
							:focusable="false"
							@click="handleResponder(solicitacao, 'RECUSADA')"
						>
							<template #icon>
								<n-icon>
									<IconReject />
								</n-icon>
							</template>
							Recusar
						</n-button>
					</template>

					<n-button
						v-else-if="solicitacao.status === 'PENDENTE' && !isRecebidas"
						size="small"
						secondary
						:loading="processingId === solicitacao.id"
						:focusable="false"
						@click="handleCancelar(solicitacao)"
					>
						<template #icon>
							<n-icon>
								<IconCancel />
							</n-icon>
						</template>
						Cancelar
					</n-button>

					<n-button
						v-else
						quaternary
						circle
						size="small"
						:loading="processingId === solicitacao.id"
						:focusable="false"
						title="Excluir do histórico"
						@click="handleExcluir(solicitacao)"
					>
						<template #icon>
							<n-icon>
								<IconDelete />
							</n-icon>
						</template>
					</n-button>
				</div>
			</div>
		</div>

		<n-pagination v-if="totalPages > 1" v-model:page="page" :page-count="totalPages" class="pagination" />
	</div>
</template>

<style scoped>
.toolbar {
	display: flex;
	gap: var(--space-4);
	margin: var(--space-5) 0;
}

.toolbar__filter {
	width: 240px;
}

.list {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.solicitacao-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-4);

	padding: var(--space-4);
	border-radius: 10px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.solicitacao-row__info {
	display: flex;
	align-items: center;
	gap: var(--space-3);
	min-width: 0;
}

.solicitacao-row__avatar {
	flex-shrink: 0;
	background: var(--cor-granada);
	color: var(--cor-papel);
	font-family: var(--font-sans);
	font-weight: 600;
	font-size: 0.8rem;
}

.solicitacao-row__textos {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.solicitacao-row__header {
	display: flex;
	align-items: center;
	gap: var(--space-2);
}

.solicitacao-row__pessoa {
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 1rem;
	color: var(--cor-tinta);
}

.solicitacao-row__motivo {
	font-family: var(--font-sans);
	font-size: 0.85rem;
	color: var(--cor-tinta-suave);
}

.solicitacao-row__mesa {
	font-family: var(--font-sans);
	font-size: 0.8rem;
	color: var(--cor-tinta-fraca);
}

.solicitacao-row__time {
	font-family: var(--font-sans);
	font-size: 0.7rem;
	color: var(--cor-tinta-fraca);
	margin-top: 2px;
}

.solicitacao-row__actions {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	flex-shrink: 0;
}

.center__container {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;

	height: 300px;
}

.pagination {
	display: flex;
	justify-content: center;
	margin-top: var(--space-6);
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NAvatar, NButton, NEmpty, NIcon, NPagination, NSpin, useDialog, useMessage } from 'naive-ui'
import { PersonAddOutline as IconAdd, PersonRemoveOutline as IconRemove } from '@vicons/ionicons5'
import { deleteAmizade, getAllAmizades } from '@/services/amizade.service'
import type { AmizadeResponse } from '@/types/amizadeTypes'
import { formatDateIntoString } from '@/composables/transformDateIntoString'
import { useAuthStore } from '@/stores/useAuth'
import AddAmizadeModal from '@/components/AddAmizadeModal.vue'

const LIMIT = 10

const dialog = useDialog()
const message = useMessage()
const auth = useAuthStore()

const page = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const amizades = ref<AmizadeResponse[]>([])
const processingId = ref<number | null>(null)
const showAddModal = ref(false)

function amigo(amizade: AmizadeResponse) {
	return amizade.userA.id === auth.user?.id ? amizade.userB : amizade.userA
}

function iniciais(nome: string) {
	return nome
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map(parte => parte[0]?.toUpperCase())
		.join('')
}

async function fetchAmizades() {
	try {
		isLoading.value = true

		const result = await getAllAmizades({ page: page.value, limit: LIMIT })

		amizades.value = result.data
		totalPages.value = result.meta.totalPages
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar as amizades.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

watch(page, fetchAmizades)

function handleDesfazer(amizade: AmizadeResponse) {
	dialog.warning({
		title: 'Desfazer amizade',
		content: `Tem certeza que deseja desfazer a amizade com ${amigo(amizade).name}?`,
		positiveText: 'Desfazer',
		negativeText: 'Cancelar',
		onPositiveClick: async () => {
			try {
				processingId.value = amizade.id

				await deleteAmizade(amizade.id)

				message.success('Amizade desfeita')

				await fetchAmizades()
			}
			catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Não foi possível desfazer a amizade.'
				message.error(errorMessage)
			}
			finally {
				processingId.value = null
			}
		}
	})
}

const isEmpty = computed(() => !isLoading.value && !amizades.value.length)

fetchAmizades()
</script>

<template>
	<div>
		<div class="toolbar">
			<n-button type="primary" :focusable="false" @click="showAddModal = true">
				<template #icon>
					<n-icon>
						<IconAdd />
					</n-icon>
				</template>
				Adicionar amigo
			</n-button>
		</div>

		<add-amizade-modal v-model:show="showAddModal" />

		<div v-if="isLoading" class="center__container">
			<n-spin size="large" />
		</div>

		<n-empty
			v-else-if="isEmpty"
			description="Você ainda não tem amigos adicionados"
			class="center__container"
		/>

		<div v-else class="list">
			<div v-for="amizade of amizades" :key="amizade.id" class="amizade-row">
				<div class="amizade-row__info">
					<n-avatar round size="small" class="amizade-row__avatar">
						{{ iniciais(amigo(amizade).name) }}
					</n-avatar>

					<div class="amizade-row__textos">
						<span class="amizade-row__pessoa">{{ amigo(amizade).name }}</span>
						<span class="amizade-row__time">Amigos desde {{ formatDateIntoString(amizade.createdAt) }}</span>
					</div>
				</div>

				<div class="amizade-row__actions">
					<n-button
						quaternary
						circle
						size="small"
						:loading="processingId === amizade.id"
						:focusable="false"
						title="Desfazer amizade"
						@click="handleDesfazer(amizade)"
					>
						<template #icon>
							<n-icon>
								<IconRemove />
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
	justify-content: flex-end;
	margin: var(--space-5) 0;
}

.list {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.amizade-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-4);

	padding: var(--space-4);
	border-radius: 10px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.amizade-row__info {
	display: flex;
	align-items: center;
	gap: var(--space-3);
	min-width: 0;
}

.amizade-row__avatar {
	flex-shrink: 0;
	background: var(--cor-granada);
	color: var(--cor-papel);
	font-family: var(--font-sans);
	font-weight: 600;
	font-size: 0.8rem;
}

.amizade-row__textos {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.amizade-row__pessoa {
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 1rem;
	color: var(--cor-tinta);
}

.amizade-row__time {
	font-family: var(--font-sans);
	font-size: 0.8rem;
	color: var(--cor-tinta-fraca);
}

.amizade-row__actions {
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

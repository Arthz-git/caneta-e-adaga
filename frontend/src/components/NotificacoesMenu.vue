<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NBadge, NButton, NIcon, NPopover, NSpin, useMessage } from 'naive-ui'
import {
	NotificationsOutline as IconBell,
	CheckmarkDoneOutline as IconMarkAllRead,
	CloseOutline as IconClose
} from '@vicons/ionicons5'
import {
	deleteNotificacao,
	getAllNotificacoes,
	getNaoLidasCount,
	markAllNotificacoesAsRead,
	markNotificacaoAsRead
} from '@/services/notificacao.service'
import type { NotificacaoResponse } from '@/types/notificacaoTypes'
import { formatDateIntoString } from '@/composables/transformDateIntoString'

const POLL_INTERVAL_MS = 30000

const router = useRouter()
const message = useMessage()

const isOpen = ref(false)
const isLoading = ref(false)
const notificacoes = ref<NotificacaoResponse[]>([])
const unreadCount = ref(0)

let pollTimer: ReturnType<typeof setInterval> | undefined

async function loadUnreadCount() {
	try {
		unreadCount.value = await getNaoLidasCount()
	}
	catch {
		// contagem é best-effort, falha silenciosa não deve incomodar o usuário
	}
}

async function loadNotificacoes() {
	try {
		isLoading.value = true
		const result = await getAllNotificacoes({ page: 1, limit: 15 })
		notificacoes.value = result.data
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar as notificações.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

async function handleOpenChange(open: boolean) {
	isOpen.value = open
	if (open) await loadNotificacoes()
}

async function handleSelect(notificacao: NotificacaoResponse) {
	if (!notificacao.readAt) {
		try {
			const atualizada = await markNotificacaoAsRead(notificacao.id)
			notificacao.readAt = atualizada.readAt
			unreadCount.value = Math.max(0, unreadCount.value - 1)
		}
		catch {
			// se marcar como lida falhar, ainda navega normalmente
		}
	}

	isOpen.value = false

	if (notificacao.mesa) {
		router.push({ name: 'mesa', params: { mesaId: notificacao.mesa.id } })
	}
}

async function handleMarkAllAsRead() {
	try {
		await markAllNotificacoesAsRead()
		notificacoes.value = notificacoes.value.map(notificacao => ({ ...notificacao, readAt: notificacao.readAt ?? new Date() }))
		unreadCount.value = 0
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível marcar as notificações como lidas.'
		message.error(errorMessage)
	}
}

async function handleDelete(notificacao: NotificacaoResponse) {
	try {
		await deleteNotificacao(notificacao.id)
		notificacoes.value = notificacoes.value.filter(item => item.id !== notificacao.id)
		if (!notificacao.readAt) unreadCount.value = Math.max(0, unreadCount.value - 1)
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível excluir a notificação.'
		message.error(errorMessage)
	}
}

onMounted(() => {
	loadUnreadCount()
	pollTimer = setInterval(loadUnreadCount, POLL_INTERVAL_MS)
})

onBeforeUnmount(() => {
	if (pollTimer) clearInterval(pollTimer)
})
</script>

<template>
	<n-popover
		trigger="click"
		placement="bottom-end"
		:show="isOpen"
		style="padding: 0;"
		@update:show="handleOpenChange"
	>
		<template #trigger>
			<n-badge :value="unreadCount" :max="99" :show="unreadCount > 0">
				<n-button
					quaternary
					circle
					aria-label="Notificações"
				>
					<template #icon>
						<n-icon>
							<IconBell />
						</n-icon>
					</template>
				</n-button>
			</n-badge>
		</template>

		<div class="notificacoes-menu">
			<div class="notificacoes-menu__header">
				<span class="notificacoes-menu__title">Notificações</span>
				<n-button
					v-if="unreadCount > 0"
					text
					size="tiny"
					@click="handleMarkAllAsRead"
				>
					<template #icon>
						<n-icon>
							<IconMarkAllRead />
						</n-icon>
					</template>
					Marcar todas como lidas
				</n-button>
			</div>

			<div v-if="isLoading" class="notificacoes-menu__center">
				<n-spin size="small" />
			</div>

			<div v-else-if="!notificacoes.length" class="notificacoes-menu__empty">
				Nenhuma notificação por aqui.
			</div>

			<div v-else class="notificacoes-menu__list">
				<div
					v-for="notificacao of notificacoes"
					:key="notificacao.id"
					class="notificacao-item"
					:class="{ 'notificacao-item--unread': !notificacao.readAt }"
					@click="handleSelect(notificacao)"
				>
					<div class="notificacao-item__body">
						<span class="notificacao-item__message">{{ notificacao.message }}</span>
						<span class="notificacao-item__time">{{ formatDateIntoString(notificacao.createdAt) }}</span>
					</div>

					<button
						type="button"
						class="notificacao-item__delete"
						aria-label="Excluir notificação"
						@click.stop="handleDelete(notificacao)"
					>
						<n-icon>
							<IconClose />
						</n-icon>
					</button>
				</div>
			</div>
		</div>
	</n-popover>
</template>

<style scoped>
.notificacoes-menu {
	display: flex;
	flex-direction: column;

	width: 320px;
	max-height: 420px;
}

.notificacoes-menu__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-2);

	padding: var(--space-3) var(--space-3);
	border-bottom: 1px solid var(--cor-linha);
}

.notificacoes-menu__title {
	color: var(--cor-tinta);
	font-family: var(--font-sans);
	font-weight: 600;
	font-size: 0.85rem;
}

.notificacoes-menu__center {
	display: flex;
	justify-content: center;
	padding: var(--space-5) 0;
}

.notificacoes-menu__empty {
	padding: var(--space-5) var(--space-3);

	color: var(--cor-tinta-fraca);
	font-family: var(--font-serif);
	font-style: italic;
	font-size: 0.85rem;
	text-align: center;
}

.notificacoes-menu__list {
	display: flex;
	flex-direction: column;

	overflow-y: auto;
}

.notificacao-item {
	display: flex;
	align-items: flex-start;
	gap: var(--space-2);

	padding: var(--space-3);
	border-bottom: 1px solid var(--cor-linha);

	cursor: pointer;
	transition: background-color 0.15s ease;
}

.notificacao-item:last-child {
	border-bottom: none;
}

.notificacao-item:hover {
	background: var(--cor-linha);
}

.notificacao-item--unread {
	background: color-mix(in srgb, var(--cor-granada) 6%, transparent);
}

.notificacao-item--unread:hover {
	background: color-mix(in srgb, var(--cor-granada) 12%, transparent);
}

.notificacao-item__body {
	display: flex;
	flex-direction: column;
	gap: 2px;
	flex: 1;
	min-width: 0;
}

.notificacao-item__message {
	color: var(--cor-tinta);
	font-family: var(--font-sans);
	font-size: 0.8rem;
	line-height: 1.4;
}

.notificacao-item--unread .notificacao-item__message {
	font-weight: 600;
}

.notificacao-item__time {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.65rem;
}

.notificacao-item__delete {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	width: 22px;
	height: 22px;
	margin-top: 1px;

	border: none;
	border-radius: 6px;
	background: transparent;
	color: var(--cor-tinta-fraca);
	cursor: pointer;
}

.notificacao-item__delete:hover {
	background: var(--cor-papel);
	color: var(--cor-tinta);
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon, NSpin, useMessage } from 'naive-ui'
import { ImageOutline as IconImage } from '@vicons/ionicons5'
import { getMyCharacters } from '@/services/characters.service'
import { getAllMesaPaginated } from '@/services/mesas.service'
import { getAllNotificacoes } from '@/services/notificacao.service'
import { useAuthStore } from '@/stores/useAuth'
import { formatRelativeTime } from '@/composables/transformDateIntoString'
import type { CharactersResponse } from '@/types/charactersTypes'
import type { MesaResponse } from '@/types/mesaTypes'
import type { NotificacaoResponse } from '@/types/notificacaoTypes'

const router = useRouter()
const message = useMessage()
const auth = useAuthStore()

const isLoading = ref(true)
const mesas = ref<MesaResponse[]>([])
const characters = ref<CharactersResponse[]>([])
const notificacoes = ref<NotificacaoResponse[]>([])

const initials = (name: string) => name
	.trim()
	.split(/\s+/)
	.slice(0, 2)
	.map(parte => parte[0]?.toUpperCase())
	.join('')

function isOwner(mesa: MesaResponse) {
	return mesa.creator.id === auth.user!.id
}

function feedVariant(tipo: NotificacaoResponse['tipo']) {
	if (tipo === 'NOVO_POST_MESA' || tipo === 'POST_PRIVADO') return 'feed-item--post'
	if (tipo === 'SOLICITACAO_ACEITA') return 'feed-item--aceita'
	return 'feed-item--pedido'
}

function goToMesa(mesaId: number) {
	router.push({ name: 'mesa', params: { mesaId } })
}

async function loadDashboard() {
	try {
		isLoading.value = true

		const [mesasResponse, charactersResponse, notificacoesResponse] = await Promise.all([
			getAllMesaPaginated({ page: 1, limit: 30 }),
			getMyCharacters(auth.user!.id),
			getAllNotificacoes({ page: 1, limit: 6 })
		])

		mesas.value = mesasResponse.data
			.filter(mesa => mesa.isMember || isOwner(mesa))
			.slice(0, 4)
		characters.value = charactersResponse
		notificacoes.value = notificacoesResponse.data
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar seu painel. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

onMounted(loadDashboard)
</script>

<template>
	<div v-if="isLoading" class="center__container">
		<n-spin size="large" />
	</div>

	<div v-else class="home">

		<header class="header">
			<div>
				<p class="header__eyebrow">Seu diário de campanhas</p>
				<h1 class="header__title">Bem-vindo de volta <em>{{ auth.user?.username }}</em>.</h1>
			</div>
			<div class="header__actions">
				<button class="btn btn--ghost" type="button" @click="router.push({ name: 'characters' })">
					Novo personagem
				</button>
				<button class="btn btn--primary" type="button" @click="router.push({ name: 'mesas' })">
					Nova mesa
				</button>
			</div>
		</header>

		<section class="block">
			<div class="block__header">
				<h2 class="block__title">Suas mesas</h2>
				<a class="block__link" href="#" @click.prevent="router.push({ name: 'mesas' })">Ver todas</a>
			</div>

			<div v-if="!mesas.length" class="empty">
				Você ainda não participa de nenhuma mesa.
			</div>

			<div v-else class="mesas">
				<div
					v-for="mesa of mesas"
					:key="mesa.id"
					class="mesa-card"
					:class="{ 'mesa-card--member': !isOwner(mesa) }"
					@click="goToMesa(mesa.id)"
				>
					<span class="mesa-card__badge">{{ isOwner(mesa) ? 'Sua mesa' : 'Membro' }}</span>
					<div class="mesa-card__avatar">
						<img v-if="mesa.imageUrl" :src="mesa.imageUrl" :alt="mesa.title" class="mesa-card__avatar-img">
						<n-icon v-else size="22"><IconImage /></n-icon>
					</div>
					<div class="mesa-card__body">
						<span class="mesa-card__title">{{ mesa.title }}</span>
						<span class="mesa-card__meta">{{ mesa.countPlayers }}/{{ mesa.maxPlayers }} jogadores{{ isOwner(mesa) ? ' · mestre' : '' }}</span>
					</div>
				</div>
			</div>
		</section>

		<section v-if="characters.length" class="block">
			<div class="block__header">
				<h2 class="block__title">Seus personagens</h2>
				<a class="block__link" href="#" @click.prevent="router.push({ name: 'characters' })">Ver todos</a>
			</div>

			<div class="char-strip">
				<div v-for="char of characters" :key="char.id" class="char-row">
					<span class="char-row__avatar">{{ initials(char.name) }}</span>
					<div class="char-row__body">
						<span class="char-row__name">{{ char.name }}</span>
						<span class="char-row__desc">{{ char.description }}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="block">
			<div class="block__header">
				<h2 class="block__title">Atividade recente</h2>
			</div>

			<div v-if="!notificacoes.length" class="empty">
				Nada de novo por aqui ainda.
			</div>

			<div v-else class="feed">
				<div v-for="notificacao of notificacoes" :key="notificacao.id" class="feed-item" :class="feedVariant(notificacao.tipo)">
					<span class="feed-item__dot" />
					<div class="feed-item__body">
						<span class="feed-item__text">{{ notificacao.message }}</span>
						<span class="feed-item__time">{{ formatRelativeTime(notificacao.createdAt) }}</span>
					</div>
				</div>
			</div>
		</section>

	</div>
</template>

<style scoped>
.center__container {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
	height: 300px;
}

.home {
	display: flex;
	flex-direction: column;
	gap: var(--space-6);
}

/* ---------- Header ---------- */

.header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: var(--space-5);
	flex-wrap: wrap;
}

.header__eyebrow {
	margin: 0 0 var(--space-1);
	font-family: var(--font-sans);
	font-size: 0.7rem;
	font-weight: 600;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--cor-tinta-fraca);
}

.header__title {
	margin: 0;
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 2.1rem;
	text-wrap: balance;
	color: var(--cor-tinta);
}

.header__title em {
	color: var(--cor-granada);
	font-style: italic;
}

.header__actions {
	display: flex;
	gap: var(--space-3);
}

.btn {
	display: inline-flex;
	align-items: center;
	gap: var(--space-2);
	padding: 10px var(--space-4);
	border-radius: 8px;
	border: 1px solid transparent;
	font-family: var(--font-sans);
	font-weight: 600;
	font-size: 0.85rem;
	cursor: pointer;
	white-space: nowrap;
}

.btn--primary {
	background: var(--cor-granada);
	color: var(--cor-papel-elevado);
	box-shadow: var(--shadow);
}

.btn--ghost {
	background: transparent;
	border-color: var(--cor-linha-forte);
	color: var(--cor-tinta);
}

/* ---------- Blocos ---------- */

.block {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.block__header {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
}

.block__title {
	margin: 0;
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 1.25rem;
	color: var(--cor-tinta);
}

.block__link {
	font-family: var(--font-sans);
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--cor-granada);
	text-decoration: none;
}

/* ---------- Mesas ---------- */

.mesas {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
	gap: var(--space-4);
}

.mesa-card {
	position: relative;
	display: flex;
	gap: var(--space-3);
	padding: var(--space-4);
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 12px;
	cursor: pointer;
}

.mesa-card__avatar {
	flex-shrink: 0;
	width: 56px;
	height: 56px;
	border-radius: 10px;
	background: linear-gradient(155deg, rgba(138, 106, 60, 0.16), transparent 70%), var(--cor-papel);
	border: 1px solid var(--cor-linha);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--cor-latao);
	overflow: hidden;
}

.mesa-card__avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.mesa-card__body {
	display: flex;
	flex-direction: column;
	gap: 3px;
	min-width: 0;
}

.mesa-card__title {
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 1rem;
	color: var(--cor-tinta);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.mesa-card__meta {
	font-size: 0.75rem;
	color: var(--cor-tinta-fraca);
}

.mesa-card__badge {
	position: absolute;
	top: -8px;
	right: var(--space-3);
	padding: 2px var(--space-2);
	border-radius: 999px;
	background: var(--cor-latao);
	border: 1px solid var(--cor-linha);
	font-size: 0.62rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	color: var(--cor-papel-elevado);
}

.mesa-card--member .mesa-card__badge {
	background: var(--cor-tinta-fraca);
}

/* ---------- Personagens ---------- */

.char-strip {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-3);
}

.char-row {
	display: flex;
	align-items: center;
	gap: var(--space-3);
	padding: var(--space-3) var(--space-4);
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 10px;
	min-width: 220px;
}

.char-row__avatar {
	width: 38px;
	height: 38px;
	border-radius: 50%;
	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 0.8rem;
	color: var(--cor-granada);
	flex-shrink: 0;
}

.char-row__body {
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.char-row__name {
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 0.88rem;
	color: var(--cor-tinta);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.char-row__desc {
	font-size: 0.72rem;
	color: var(--cor-tinta-fraca);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* ---------- Atividade recente ---------- */

.feed {
	display: flex;
	flex-direction: column;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 12px;
	overflow: hidden;
}

.feed-item {
	display: flex;
	gap: var(--space-3);
	padding: var(--space-3) var(--space-4);
	border-bottom: 1px solid var(--cor-linha);
}

.feed-item:last-child { border-bottom: none; }

.feed-item__dot {
	flex-shrink: 0;
	width: 8px;
	height: 8px;
	margin-top: 7px;
	border-radius: 50%;
	background: var(--cor-linha-forte);
}

.feed-item--post .feed-item__dot { background: var(--cor-latao); }
.feed-item--aceita .feed-item__dot { background: var(--cor-tinta-fraca); }
.feed-item--pedido .feed-item__dot { background: var(--cor-granada); }

.feed-item__body {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.feed-item__text {
	font-size: 0.85rem;
	color: var(--cor-tinta);
}

.feed-item__time {
	font-size: 0.7rem;
	color: var(--cor-tinta-fraca);
}

.empty {
	padding: var(--space-4);
	border-radius: 10px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.85rem;
}

@media (max-width: 620px) {
	.header { flex-direction: column; align-items: flex-start; }
}
</style>

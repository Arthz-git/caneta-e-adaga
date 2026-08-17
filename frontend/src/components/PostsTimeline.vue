<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import DOMPurify from 'dompurify'
import { NIcon, NSpin, NButton, useMessage } from 'naive-ui'
import {
	PersonOutline as IconPerson,
	PersonCircleOutline as IconNpc,
	ChevronUpOutline as IconChevronUp,
	EyeOffOutline as IconRestricted,
	LockClosedOutline as IconHidden
} from '@vicons/ionicons5'
import { getLastPostId, getPaginatedPosts } from '@/services/posts.service'
import type { PostListItem } from '@/types/postTypes'
import { formatDateIntoString } from '@/composables/transformDateIntoString'
import { useAuthStore } from '@/stores/useAuth'

// ----------------------------------------------------------------------

const props = defineProps<{
	mesaId: number
	isMaster?: boolean
	currentPlayerId?: number
}>()

const PAGE_SIZE = 20

const message = useMessage()
const auth = useAuthStore()

const posts = defineModel<PostListItem[]>('posts', { default: () => [] })
const currentPage = ref(1)
const lastPostId = ref<number | null>(null)
const isLoadingInitial = ref(false)
const isLoadingMore = ref(false)

const scrollEl = ref<HTMLDivElement | null>(null)
const lightboxSrc = ref<string | null>(null)

const hasOlderPosts = () => currentPage.value > 1

function handleContentClick(event: MouseEvent) {
	const target = event.target as HTMLElement
	if (target.tagName === 'IMG') {
		lightboxSrc.value = (target as HTMLImageElement).src
	}
}

function closeLightbox() {
	lightboxSrc.value = null
}

const narrativePosts = computed(() => posts.value.filter(post => post.type !== 'OOC' && post.type !== 'SYSTEM'))

function sanitize(html: string) {
	return DOMPurify.sanitize(html)
}

function speakerName(post: PostListItem) {
	if (post.type === 'NPC') return post.npcName ?? 'NPC'
	if (post.type === 'CHARACTER') return post.character?.name ?? post.author.name
	return post.author.name
}

function isOwnPost(post: PostListItem) {
	return post.userId === auth.user?.id
}

function isRestricted(post: PostListItem) {
	return post.visiblePlayerIds.length > 0
}

function canViewRestrictedContent(post: PostListItem) {
	if (!isRestricted(post)) return true
	if (props.isMaster || isOwnPost(post)) return true

	return props.currentPlayerId != null && post.visiblePlayerIds.includes(props.currentPlayerId)
}

const restrictedTitle = computed(() => (
	props.isMaster
		? 'Mensagem restrita a jogadores selecionados'
		: 'Mensagem restrita — visível apenas para você'
))

async function scrollToBottom() {
	await nextTick()
	if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

async function loadInitial() {
	try {
		isLoadingInitial.value = true

		const first = await getPaginatedPosts(props.mesaId, { page: 1, limit: PAGE_SIZE })

		const latest = first.meta.totalPages > 1
			? await getPaginatedPosts(props.mesaId, { page: first.meta.totalPages, limit: PAGE_SIZE })
			: first

		posts.value = latest.data
		currentPage.value = latest.meta.page
		lastPostId.value = latest.data.at(-1)?.id ?? null

		isLoadingInitial.value = false
		await scrollToBottom()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar as mensagens. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoadingInitial.value = false
	}
}

async function loadOlderPosts() {
	if (isLoadingMore.value || !hasOlderPosts() || !scrollEl.value) return

	try {
		isLoadingMore.value = true

		const previousScrollHeight = scrollEl.value.scrollHeight
		const previousScrollTop = scrollEl.value.scrollTop

		const older = await getPaginatedPosts(props.mesaId, { page: currentPage.value - 1, limit: PAGE_SIZE })

		posts.value = [...older.data, ...posts.value]
		currentPage.value = older.meta.page

		await nextTick()
		if (scrollEl.value) {
			scrollEl.value.scrollTop = scrollEl.value.scrollHeight - previousScrollHeight + previousScrollTop
		}
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar mensagens mais antigas. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoadingMore.value = false
	}
}

async function isUpToDate() {
	const remoteLastPostId = await getLastPostId(props.mesaId)

	return remoteLastPostId === lastPostId.value
}

onMounted(loadInitial)

defineExpose({
	reload: loadInitial,
	isUpToDate
})
</script>

<template>
	<div class="posts-timeline">
		<div
			v-if="isLoadingInitial"
			class="posts-timeline__center"
		>
			<n-spin size="large" />
		</div>

		<div
			v-else
			ref="scrollEl"
			class="posts-timeline__scroll"
			@click="handleContentClick"
		>
			<div
				v-if="hasOlderPosts()"
				class="posts-timeline__load-more"
			>
				<n-button
					size="small"
					secondary
					:loading="isLoadingMore"
					:focusable="false"
					@click="loadOlderPosts"
				>
					<template #icon>
						<n-icon>
							<IconChevronUp />
						</n-icon>
					</template>
					Carregar mensagens mais antigas
				</n-button>
			</div>

			<div
				v-if="!narrativePosts.length"
				class="posts-timeline__empty"
			>
				Nenhuma mensagem por aqui ainda. Que tal começar a história?
			</div>

			<div
				v-for="post of narrativePosts"
				:key="post.id"
				class="post-row"
				:class="[`post-row--${post.type.toLowerCase()}`, { 'post-row--own': isOwnPost(post) }]"
			>
				<template v-if="!canViewRestrictedContent(post)">
					<div class="post-hidden">
						<n-icon class="post-hidden__icon">
							<IconHidden />
						</n-icon>

						<span class="post-hidden__text">Uma mensagem oculta foi enviada aqui</span>

						<span class="post-hidden__time">
							{{ formatDateIntoString(post.createdAt) }}
						</span>
					</div>
				</template>

				<template v-else-if="post.type === 'NARRATOR'">
					<div class="post-narrator">
						<span
							v-if="isRestricted(post)"
							class="restricted-badge restricted-badge--narrator"
							:title="restrictedTitle"
						>
							<n-icon>
								<IconRestricted />
							</n-icon>

							<span class="restricted-badge__label">
								Mensagem restrita
							</span>
						</span>
						
						<div class="post-narrator__text" v-html="sanitize(post.text)" />

						<span class="post-narrator__time">
							{{ formatDateIntoString(post.createdAt) }}
						</span>
					</div>
				</template>

				<template v-else>
					<div class="post-bubble">
						<div class="post-bubble__avatar">
							<img
								v-if="post.character?.imageUrl"
								:src="post.character.imageUrl"
								:alt="post.character.name"
								class="post-bubble__avatar-img"
							>
							<n-icon v-else-if="post.type === 'NPC'">
								<IconNpc />
							</n-icon>

							<n-icon v-else>
								<IconPerson />
							</n-icon>

							<n-icon
								v-if="isRestricted(post)"
								class="restricted-badge"
								:title="restrictedTitle"
							>
								<IconRestricted />
							</n-icon>
						</div>

						<div class="post-bubble__body">
							<div class="post-bubble__header">
								<span class="post-bubble__speaker">
									{{ speakerName(post) }}
								</span>

								<span v-if="post.type === 'CHARACTER'" class="post-bubble__author">
									{{ post.author.name }}
								</span>

								<span v-else-if="post.type === 'NPC'" class="post-bubble__author">
									NPC de {{ post.author.name }}
								</span>

								<span
									v-if="isRestricted(post)"
									class="restricted-badge__label restricted-badge__label--inline"
									:title="restrictedTitle"
								>
									Mensagem restrita
								</span>

								<span class="post-bubble__time">
									{{ formatDateIntoString(post.createdAt) }}
								</span>
							</div>

							<div class="post-bubble__text" v-html="sanitize(post.text)" />
						</div>
					</div>
				</template>
			</div>
		</div>

		<Teleport to="body">
			<div
				v-if="lightboxSrc"
				class="posts-lightbox"
				@click="closeLightbox"
			>
				<img :src="lightboxSrc" class="posts-lightbox__img" @click.stop>
			</div>
		</Teleport>
	</div>
</template>

<style scoped>
.posts-timeline {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
	width: 100%;
	height: 100%;

	padding-right: var(--space-4);
}

.posts-timeline__center {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
}

.posts-timeline__scroll {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
	overflow-y: auto;

	padding: var(--space-4);
	padding-bottom: 100px;
	scrollbar-width: thin;
	scrollbar-color: var(--cor-linha) transparent;

	-webkit-mask-image: linear-gradient(to top, transparent 0, black var(--space-6), black 100%);
	mask-image: linear-gradient(to top, transparent 0, black var(--space-6), black 100%);
}

.posts-timeline__scroll::-webkit-scrollbar {
	width: 6px;
}

.posts-timeline__scroll::-webkit-scrollbar-thumb {
	background: var(--cor-linha);
	border-radius: 3px;
}

.posts-timeline__scroll::-webkit-scrollbar-track {
	background: transparent;
}

.posts-timeline__load-more {
	display: flex;
	justify-content: center;

	margin-bottom: var(--space-3);
}

.posts-timeline__empty {
	margin: auto;

	color: var(--cor-tinta-fraca);
	font-family: var(--font-serif);
	font-style: italic;
	text-align: center;
}

.post-row + .post-row {
	margin-top: var(--space-4);
}

.post-narrator {
	position: relative;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-1);

	width: 100%;
	padding: var(--space-3) var(--space-4);

	background: var(--cor-papel);
	border: 1px solid color-mix(in srgb, var(--cor-granada) 40%, var(--cor-linha));
	border-radius: 14px;
}

.post-narrator__text {
	color: var(--cor-granada);
	font-family: var(--font-serif);
	font-style: italic;
	font-size: 0.95rem;
	line-height: 1.5;
	text-align: center;
}

.post-narrator__text :deep(p) {
	margin: 0;
}

.post-narrator__text :deep(img),
.post-bubble__text :deep(img) {
	max-width: 100%;
	max-height: 320px;
	border-radius: 8px;
	margin-top: var(--space-1);
	cursor: zoom-in;
}

.posts-lightbox {
	position: fixed;
	inset: 0;
	z-index: 1000;

	display: flex;
	justify-content: center;
	align-items: center;

	padding: var(--space-6);

	background: rgba(0, 0, 0, 0.75);
	cursor: zoom-out;
}

.posts-lightbox__img {
	max-width: 100%;
	max-height: 100%;

	border-radius: 8px;
	box-shadow: var(--shadow);
	cursor: default;
}

.post-narrator__time {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.6rem;
	opacity: 0.8;
}

.post-hidden {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-2);

	width: 100%;
	padding: var(--space-2) var(--space-4);

	background: color-mix(in srgb, var(--cor-tinta-fraca) 6%, transparent);
	border: 1px dashed color-mix(in srgb, var(--cor-tinta-fraca) 35%, transparent);
	border-radius: 14px;
}

.post-hidden__icon {
	color: var(--cor-tinta-fraca);
	font-size: 0.9rem;
	opacity: 0.7;
}

.post-hidden__text {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.75rem;
	font-style: italic;
	opacity: 0.8;
}

.post-hidden__time {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.6rem;
	opacity: 0.6;
}

.post-bubble {
	display: flex;
	flex-direction: row;
	gap: var(--space-2);

	max-width: min(640px, 88%);
}

.post-row--own .post-bubble {
	flex-direction: row-reverse;
	margin-left: auto;
}

.post-bubble__avatar {
	position: relative;

	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	height: 34px;
	width: 34px;
	margin-top: 2px;

	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
	border-radius: 50%;
	color: var(--cor-tinta-fraca);
	font-size: 1rem;

	overflow: hidden;
	transition: border-color 0.15s ease;
}

.post-row--npc .post-bubble__avatar {
	border-color: color-mix(in srgb, var(--cor-granada) 45%, var(--cor-linha));
	color: var(--cor-granada);
}

.post-row--own .post-bubble__avatar {
	border-color: color-mix(in srgb, var(--cor-latao-suave) 55%, var(--cor-linha));
}

.post-bubble__avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.post-bubble__body {
	display: flex;
	flex-direction: column;
	gap: 3px;
	min-width: 0;
}

.post-row--own .post-bubble__body {
	align-items: flex-end;
}

.post-bubble__header {
	display: flex;
	align-items: baseline;
	gap: var(--space-2);

	padding-inline: 2px;
}

.post-bubble__speaker {
	color: var(--cor-tinta-suave);
	font-family: var(--font-serif);
	font-weight: 600;
	font-size: 0.9rem;
}

.post-row--npc .post-bubble__speaker {
	color: var(--cor-granada);
}

.post-bubble__author {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.65rem;
}

.restricted-badge {
	position: absolute;
	top: -5px;
	right: -5px;
	z-index: 1;

	display: flex;
	justify-content: center;
	align-items: center;

	height: 24px;
	width: 24px;

	background: var(--cor-papel);
	border: 1px solid color-mix(in srgb, var(--cor-granada) 55%, transparent);
	border-radius: 50%;
	color: var(--cor-granada);
	font-size: 0.85rem;
}

.restricted-badge--narrator {
	position: static;

	display: inline-flex;
	align-items: center;
	gap: var(--space-1);

	height: auto;
	width: auto;
	padding: 2px var(--space-2);

	border-radius: 999px;
}

.restricted-badge__label {
	color: var(--cor-granada);
	font-family: var(--font-sans);
	font-size: 0.65rem;
	font-weight: 600;
	white-space: nowrap;
}

.restricted-badge__label--inline {
	padding: 1px var(--space-2);

	background: var(--cor-papel);
	border: 1px solid color-mix(in srgb, var(--cor-granada) 55%, transparent);
	border-radius: 999px;
}

.post-bubble__time {
	margin-left: auto;

	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.6rem;
	opacity: 0.7;
}

.post-row--own .post-bubble__time {
	margin-left: 0;
}

.post-bubble__text {
	padding: var(--space-2) var(--space-3);

	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
	border-radius: 4px 14px 14px 14px;
	color: var(--cor-tinta);
	font-family: var(--font-sans);
	font-size: 0.85rem;
	line-height: 1.45;

	transition: border-color 0.15s ease;
}

.post-row--own .post-bubble__text {
	background: color-mix(in srgb, var(--cor-latao-suave) 10%, var(--cor-papel));
	border-color: color-mix(in srgb, var(--cor-latao-suave) 40%, var(--cor-linha));
	border-radius: 14px 4px 14px 14px;
}

.post-row--npc .post-bubble__text {
	background: color-mix(in srgb, var(--cor-granada) 6%, var(--cor-papel));
	border-color: color-mix(in srgb, var(--cor-granada) 30%, var(--cor-linha));
}

.post-bubble__text :deep(p) {
	margin: 0;
}

.post-bubble__text :deep(p + p) {
	margin-top: var(--space-1);
}
</style>

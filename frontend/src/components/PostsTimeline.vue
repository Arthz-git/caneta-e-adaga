<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import DOMPurify from 'dompurify'
import { NIcon, NSpin, NButton, useMessage } from 'naive-ui'
import {
	PersonOutline as IconPerson,
	PersonCircleOutline as IconNpc,
	InformationCircleOutline as IconSystem,
	ChevronUpOutline as IconChevronUp
} from '@vicons/ionicons5'
import { getLastPostId, getPaginatedPosts } from '@/services/posts.service'
import type { PostListItem } from '@/types/postTypes'
import { formatDateIntoString } from '@/composables/transformDateIntoString'
import { useAuthStore } from '@/stores/useAuth'

// ----------------------------------------------------------------------

const props = defineProps<{
	mesaId: number
}>()

const PAGE_SIZE = 20

const message = useMessage()
const auth = useAuthStore()

const posts = ref<PostListItem[]>([])
const currentPage = ref(1)
const lastPostId = ref<number | null>(null)
const isLoadingInitial = ref(false)
const isLoadingMore = ref(false)
const isNearTop = ref(false)

const scrollEl = ref<HTMLDivElement | null>(null)

const hasOlderPosts = () => currentPage.value > 1

function sanitize(html: string) {
	return DOMPurify.sanitize(html)
}

function formatPostTime(date: string) {
	return formatDateIntoString(new Date(date), 'HH:mm')
}

function speakerName(post: PostListItem) {
	if (post.type === 'NPC') return post.npcName ?? 'NPC'
	if (post.type === 'CHARACTER') return post.character?.name ?? post.author.name
	return post.author.name
}

function isOwnPost(post: PostListItem) {
	return post.userId === auth.user?.id
}

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

function onScroll() {
	if (!scrollEl.value) return

	isNearTop.value = scrollEl.value.scrollTop < 60
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
			@scroll="onScroll"
		>
			<div
				v-if="hasOlderPosts()"
				class="posts-timeline__load-more"
				:class="{ 'posts-timeline__load-more--visible': isNearTop }"
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
				v-if="!posts.length"
				class="posts-timeline__empty"
			>
				Nenhuma mensagem por aqui ainda. Que tal começar a história?
			</div>

			<div
				v-for="post of posts"
				:key="post.id"
				class="post-row"
				:class="[`post-row--${post.type.toLowerCase()}`, { 'post-row--own': isOwnPost(post) }]"
			>
				<template v-if="post.type === 'NARRATOR'">
					<div class="post-narrator">
						<div class="post-narrator__text" v-html="sanitize(post.text)" />
						<span class="post-narrator__time">{{ formatPostTime(post.createdAt) }}</span>
					</div>
				</template>

				<template v-else-if="post.type === 'SYSTEM'">
					<div class="post-system">
						<n-icon>
							<IconSystem />
						</n-icon>
						<span class="post-system__text" v-html="sanitize(post.text)" />
						<span class="post-system__time">{{ formatPostTime(post.createdAt) }}</span>
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
						</div>

						<div class="post-bubble__body">
							<div class="post-bubble__header">
								<span class="post-bubble__speaker">{{ speakerName(post) }}</span>

								<span v-if="post.type === 'CHARACTER'" class="post-bubble__author">
									{{ post.author.name }}
								</span>
								<span v-else-if="post.type === 'NPC'" class="post-bubble__author">
									NPC de {{ post.author.name }}
								</span>
								<span v-else class="post-bubble__author post-bubble__author--ooc">
									OOC
								</span>

								<span class="post-bubble__time">{{ formatPostTime(post.createdAt) }}</span>
							</div>

							<div class="post-bubble__text" v-html="sanitize(post.text)" />
						</div>
					</div>
				</template>
			</div>
		</div>
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
	scrollbar-width: thin;
	scrollbar-color: var(--cor-linha) transparent;
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

	height: 0;
	margin-bottom: 0;
	opacity: 0;
	overflow: hidden;

	transition: height 0.15s ease, opacity 0.15s ease, margin-bottom 0.15s ease;
}

.posts-timeline__load-more--visible {
	height: 32px;
	margin-bottom: var(--space-3);
	opacity: 1;
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

	padding: var(--space-3) var(--space-5);
	margin-inline: auto;
	max-width: min(560px, 90%);
}

.post-narrator::before,
.post-narrator::after {
	content: '';

	width: 32px;
	height: 1px;

	background: linear-gradient(90deg, transparent, var(--cor-granada), transparent);
	opacity: 0.5;
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

.post-narrator__time {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.6rem;
	opacity: 0.8;
}

.post-system {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: var(--space-2);

	width: fit-content;
	margin-inline: auto;
	padding: 5px var(--space-3);

	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 999px;
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.7rem;
}

.post-system :deep(.n-icon) {
	color: var(--cor-latao);
	font-size: 0.85rem;
}

.post-system__time {
	opacity: 0.6;
	font-size: 0.6rem;
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

.post-row--ooc .post-bubble {
	opacity: 0.8;
}

.post-bubble__avatar {
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
	box-shadow: var(--shadow);
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
	border-color: color-mix(in srgb, var(--cor-latao) 55%, var(--cor-linha));
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
	color: var(--cor-tinta);
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

.post-bubble__author--ooc {
	text-transform: uppercase;
	letter-spacing: 0.03em;
	color: var(--cor-latao);
	font-weight: 600;
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
	box-shadow: var(--shadow);
	color: var(--cor-tinta);
	font-family: var(--font-sans);
	font-size: 0.85rem;
	line-height: 1.45;

	transition: border-color 0.15s ease;
}

.post-row--own .post-bubble__text {
	background: color-mix(in srgb, var(--cor-latao) 10%, var(--cor-papel));
	border-color: color-mix(in srgb, var(--cor-latao) 40%, var(--cor-linha));
	border-radius: 14px 4px 14px 14px;
}

.post-row--npc .post-bubble__text {
	background: color-mix(in srgb, var(--cor-granada) 6%, var(--cor-papel));
	border-color: color-mix(in srgb, var(--cor-granada) 30%, var(--cor-linha));
}

.post-row--ooc .post-bubble__text {
	border-style: dashed;
	box-shadow: none;
	font-style: italic;
}

.post-bubble__text :deep(p) {
	margin: 0;
}

.post-bubble__text :deep(p + p) {
	margin-top: var(--space-1);
}
</style>

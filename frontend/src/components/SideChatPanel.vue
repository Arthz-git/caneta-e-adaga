<script setup lang="ts">
import DOMPurify from 'dompurify'
import { NIcon } from 'naive-ui'
import { InformationCircleOutline as IconSystem, EyeOffOutline as IconRestricted, LockClosedOutline as IconHidden } from '@vicons/ionicons5'
import type { PostListItem } from '@/types/postTypes'
import { formatDateIntoString } from '@/composables/transformDateIntoString'
import { useAuthStore } from '@/stores/useAuth'

// ----------------------------------------------------------------------

const props = defineProps<{
	posts: PostListItem[]
	isMaster?: boolean
	currentPlayerId?: number
}>()

const auth = useAuthStore()

function sanitize(html: string) {
	return DOMPurify.sanitize(html)
}

function isRestricted(post: PostListItem) {
	return post.visiblePlayerIds.length > 0
}

function canViewRestrictedContent(post: PostListItem) {
	if (!isRestricted(post)) return true
	if (props.isMaster || post.userId === auth.user?.id) return true

	return props.currentPlayerId != null && post.visiblePlayerIds.includes(props.currentPlayerId)
}
</script>

<template>
	<div class="side-chat">
		<p class="side-chat__title">
			OOC & Sistema
		</p>

		<div
			v-if="!posts.length"
			class="side-chat__empty"
		>
			Nenhuma mensagem OOC ou de sistema ainda.
		</div>

		<div
			v-for="post of posts"
			:key="post.id"
			class="side-chat__row"
			:class="`side-chat__row--${post.type.toLowerCase()}`"
		>
			<template v-if="!canViewRestrictedContent(post)">
				<div class="side-chat__bubble side-chat__bubble--hidden">
					<n-icon>
						<IconHidden />
					</n-icon>

					<span>Mensagem oculta</span>
				</div>
			</template>

			<template v-else-if="post.type === 'SYSTEM'">
				<div class="side-chat__bubble side-chat__bubble--system">
					<n-icon>
						<IconSystem />
					</n-icon>

					<div class="side-chat__text" v-html="sanitize(post.text)" />
				</div>
			</template>

			<template v-else>
				<div class="side-chat__bubble side-chat__bubble--ooc">
					<div class="side-chat__header">
						<span class="side-chat__speaker">
							{{ post.author.name }}
						</span>

						<n-icon v-if="isRestricted(post)" class="side-chat__restricted" title="Mensagem restrita a alguns jogadores">
							<IconRestricted />
						</n-icon>
					</div>

					<div class="side-chat__text" v-html="sanitize(post.text)" />
				</div>
			</template>

			<span class="side-chat__time">{{ formatDateIntoString(post.createdAt) }}</span>
		</div>
	</div>
</template>

<style scoped>
.side-chat {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.side-chat__title {
	margin-bottom: var(--space-1);

	text-transform: uppercase;
	font-size: 0.65rem;
	font-weight: 600;
	color: var(--cor-tinta-fraca);
}

.side-chat__empty {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-serif);
	font-size: 0.8rem;
	font-style: italic;
}

.side-chat__row {
	display: flex;
	flex-direction: column;
	gap: 3px;
}

.side-chat__row + .side-chat__row {
	margin-top: var(--space-1);
}

.side-chat__bubble {
	padding: var(--space-2);

	border: 1px solid var(--cor-linha);
	border-radius: 4px 12px 12px 12px;
	font-family: var(--font-sans);
	font-size: 0.78rem;
	line-height: 1.4;
}

.side-chat__bubble--ooc {
	background: color-mix(in srgb, var(--cor-latao-suave) 8%, var(--cor-papel));
	border-color: color-mix(in srgb, var(--cor-latao-suave) 35%, var(--cor-linha));
	border-style: dashed;
	color: var(--cor-tinta);
	font-style: italic;
}

.side-chat__bubble--system {
	display: flex;
	align-items: flex-start;
	gap: 6px;

	background: var(--cor-papel-elevado);
	border-radius: 12px;
	color: var(--cor-tinta-fraca);
	font-style: normal;
}

.side-chat__bubble--system :deep(.n-icon) {
	flex-shrink: 0;
	margin-top: 1px;

	color: var(--cor-latao-suave);
	font-size: 0.85rem;
}

.side-chat__bubble--hidden {
	display: flex;
	align-items: center;
	gap: 6px;

	background: color-mix(in srgb, var(--cor-tinta-fraca) 6%, transparent);
	border-style: dashed;
	color: var(--cor-tinta-fraca);
	font-style: italic;
	opacity: 0.85;
}

.side-chat__header {
	display: flex;
	align-items: center;
	gap: 4px;

	padding-inline: 2px;
}

.side-chat__speaker {
	text-transform: uppercase;
	letter-spacing: 0.03em;
	color: var(--cor-latao-suave);
	font-family: var(--font-sans);
	font-size: 0.65rem;
	font-weight: 600;
	font-style: normal;
}

.side-chat__restricted {
	color: var(--cor-tinta-fraca);
	font-size: 0.7rem;
}

.side-chat__text :deep(p) {
	margin: 0;
}

.side-chat__text :deep(p + p) {
	margin-top: 4px;
}

.side-chat__time {
	align-self: flex-end;

	padding-inline: 2px;

	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.6rem;
	opacity: 0.7;
}
</style>

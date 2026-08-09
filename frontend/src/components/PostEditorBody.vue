<script setup lang="ts">
import { computed } from 'vue'
import { NIcon, NPopover, NCheckbox } from 'naive-ui'
import { EditorContent, type Editor } from '@tiptap/vue-3'
import {
	ListOutline as IconList,
	CloseOutline as IconClose,
	AtOutline as IconAt,
	ExpandOutline as IconExpand,
	ContractOutline as IconContract,
	PeopleOutline as IconPeople
} from '@vicons/ionicons5'
import { POST_TYPE_LABELS, type PostType } from '@/types/postTypes'

// ----------------------------------------------------------------------

interface TargetPlayer {
	id: number
	name: string
}

const props = withDefaults(defineProps<{
	editor: Editor
	expanded?: boolean
	allowedPostTypes?: PostType[]
	players?: TargetPlayer[]
}>(), {
	allowedPostTypes: () => Object.keys(POST_TYPE_LABELS) as PostType[],
	players: () => []
})

const emit = defineEmits<{
	toggleExpand: []
}>()

const postType = defineModel<PostType>('postType', { default: 'NARRATOR' })
const visiblePlayerIds = defineModel<number[]>('visiblePlayerIds', { default: () => [] })

const visibilityLabel = computed(() => (
	visiblePlayerIds.value.length ? `Visível para ${visiblePlayerIds.value.length}` : 'Visível para todos'
))

function togglePlayer(playerId: number, checked: boolean) {
	visiblePlayerIds.value = checked
		? [...visiblePlayerIds.value, playerId]
		: visiblePlayerIds.value.filter(id => id !== playerId)
}

const postTypeOptions = computed(() => (
	(Object.entries(POST_TYPE_LABELS) as [PostType, string][])
		.filter(([value]) => props.allowedPostTypes.includes(value))
))

function setTextColor(event: Event) {
	const color = (event.target as HTMLInputElement).value
	props.editor.chain().focus().setColor(color).run()
}

function setHighlightColor(event: Event) {
	const color = (event.target as HTMLInputElement).value
	props.editor.chain().focus().setHighlight({ color }).run()
}

function insertMentionTrigger() {
	props.editor.chain().focus().insertContent('@').run()
}
</script>

<template>
	<div class="post-editor" :class="{ 'post-editor--expanded': expanded }">
		<div class="post-editor__toolbar">
			<select
				v-model="postType"
				class="post-editor__type-select"
				title="Tipo do post"
			>
				<option
					v-for="[value, label] of postTypeOptions"
					:key="value"
					:value="value"
				>
					{{ label }}
				</option>
			</select>

			<div class="post-editor__toolbar-divider" />

			<button
				type="button"
				class="post-editor__toolbar-btn"
				:class="{ 'post-editor__toolbar-btn--active': editor.isActive('bold') }"
				@click="editor.chain().focus().toggleBold().run()"
			>
				<strong>B</strong>
			</button>

			<button
				type="button"
				class="post-editor__toolbar-btn"
				:class="{ 'post-editor__toolbar-btn--active': editor.isActive('italic') }"
				@click="editor.chain().focus().toggleItalic().run()"
			>
				<em>I</em>
			</button>

			<button
				type="button"
				class="post-editor__toolbar-btn"
				:class="{ 'post-editor__toolbar-btn--active': editor.isActive('bulletList') }"
				@click="editor.chain().focus().toggleBulletList().run()"
			>
				<n-icon>
					<IconList />
				</n-icon>
			</button>

			<button
				type="button"
				class="post-editor__toolbar-btn"
				title="Mencionar jogador ou personagem"
				@click="insertMentionTrigger"
			>
				<n-icon>
					<IconAt />
				</n-icon>
			</button>

			<div class="post-editor__toolbar-divider" />

			<label class="post-editor__toolbar-btn post-editor__color-swatch" title="Cor da letra">
				A
				<input type="color" @input="setTextColor">
			</label>

			<button
				type="button"
				class="post-editor__toolbar-btn"
				title="Remover cor da letra"
				@click="editor.chain().focus().unsetColor().run()"
			>
				<n-icon>
					<IconClose />
				</n-icon>
			</button>

			<label class="post-editor__toolbar-btn post-editor__color-swatch post-editor__color-swatch--highlight" title="Cor de fundo">
				A
				<input type="color" @input="setHighlightColor">
			</label>

			<button
				type="button"
				class="post-editor__toolbar-btn"
				title="Remover cor de fundo"
				@click="editor.chain().focus().unsetHighlight().run()"
			>
				<n-icon>
					<IconClose />
				</n-icon>
			</button>

			<n-popover v-if="players.length" trigger="click" placement="top-start">
				<template #trigger>
					<button
						type="button"
						class="post-editor__toolbar-btn post-editor__visibility-btn"
						:class="{ 'post-editor__toolbar-btn--active': visiblePlayerIds.length }"
						title="Definir quem pode ver esta mensagem"
					>
						<n-icon>
							<IconPeople />
						</n-icon>

						<span>{{ visibilityLabel }}</span>
					</button>
				</template>

				<div class="post-editor__visibility-list">
					<n-checkbox
						v-for="player of players"
						:key="player.id"
						:checked="visiblePlayerIds.includes(player.id)"
						@update:checked="(checked: boolean) => togglePlayer(player.id, checked)"
					>
						{{ player.name }}
					</n-checkbox>
				</div>
			</n-popover>

			<div class="post-editor__toolbar-spacer" />

			<button
				type="button"
				class="post-editor__toolbar-btn"
				:title="expanded ? 'Fechar tela expandida' : 'Expandir editor'"
				@click="emit('toggleExpand')"
			>
				<n-icon>
					<IconContract v-if="expanded" />
					<IconExpand v-else />
				</n-icon>
			</button>
		</div>

		<EditorContent
			:editor="editor"
			class="post-editor__scroll"
		/>
	</div>
</template>

<style scoped>
.post-editor {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
	width: 100%;
	height: 100%;

	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
	border-radius: 10px;
	overflow: hidden;
}

.post-editor__toolbar {
	display: flex;
	flex-direction: row;
	gap: var(--space-1);

	padding: var(--space-2);
	border-bottom: 1px solid var(--cor-linha);
}

.post-editor__toolbar-btn {
	display: flex;
	justify-content: center;
	align-items: center;

	width: 28px;
	height: 28px;

	background: transparent;
	border: 1px solid transparent;
	border-radius: 6px;
	color: var(--cor-tinta-fraca);
	cursor: pointer;
	font-size: 0.85rem;

	transition: border-color 0.15s ease, color 0.15s ease;
}

.post-editor__toolbar-btn:hover {
	color: var(--cor-tinta);
}

.post-editor__toolbar-btn--active {
	border-color: var(--cor-latao);
	color: var(--cor-latao);
}

.post-editor__type-select {
	height: 28px;
	padding: 0 var(--space-2);

	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 6px;
	color: var(--cor-tinta);
	cursor: pointer;
	font-family: var(--font-sans);
	font-size: 0.75rem;

	transition: border-color 0.15s ease;
}

.post-editor__type-select:hover,
.post-editor__type-select:focus {
	border-color: var(--cor-latao);
	outline: none;
}

.post-editor__toolbar-divider {
	width: 1px;
	margin: 4px var(--space-1);

	background: var(--cor-linha);
}

.post-editor__toolbar-spacer {
	flex: 1;
}

.post-editor__visibility-btn {
	width: auto;
	gap: 4px;
	padding: 0 var(--space-2);
	font-size: 0.7rem;
	white-space: nowrap;
}

.post-editor__visibility-list {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);

	max-height: 200px;
	overflow-y: auto;
}

.post-editor__color-swatch {
	position: relative;

	font-weight: 700;
}

.post-editor__color-swatch::after {
	content: '';
	position: absolute;
	left: 5px;
	right: 5px;
	bottom: 4px;

	height: 3px;
	border-radius: 2px;
	background: var(--cor-granada);
}

.post-editor__color-swatch--highlight::after {
	background: var(--cor-latao);
}

.post-editor__color-swatch input[type='color'] {
	position: absolute;
	inset: 0;

	width: 100%;
	height: 100%;
	padding: 0;
	border: none;

	opacity: 0;
	cursor: pointer;
}

.post-editor__scroll {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
}

.post-editor :deep(.post-editor__content) {
	height: 100%;
	padding: var(--space-3);

	font-family: var(--font-sans);
	color: var(--cor-tinta);
	outline: none;
	font-size: 0.75rem;
}

.post-editor--expanded :deep(.post-editor__content) {
	font-size: 0.75rem;
	padding: var(--space-5);
}

.post-editor :deep(.post-editor__content p) {
	margin: 0;
}

.post-editor :deep(.post-editor__mention) {
	padding: 1px 4px;

	background: color-mix(in srgb, var(--cor-latao) 18%, transparent);
	border-radius: 4px;
	color: var(--cor-latao);
	font-weight: 600;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NModal } from 'naive-ui'
import { useEditor, VueRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import tippy, { type Instance as TippyInstance } from 'tippy.js'
import MentionList from './MentionList.vue'
import PostEditorBody from './PostEditorBody.vue'
import type { PostType } from '@/types/postTypes'

// ----------------------------------------------------------------------

const props = withDefaults(defineProps<{
	mentionItems?: string[]
}>(), {
	mentionItems: () => []
})

const content = defineModel<string>({ default: '' })
const postType = defineModel<PostType>('postType', { default: 'NARRATOR' })

const isExpanded = ref(false)

const editor = useEditor({
	content: content.value,
	extensions: [
		StarterKit,
		TextStyle,
		Color,
		Highlight.configure({ multicolor: true }),
		Mention.configure({
			HTMLAttributes: { class: 'post-editor__mention' },
			suggestion: {
				items: ({ query }: { query: string }) => props.mentionItems
					.filter(item => item.toLowerCase().includes(query.toLowerCase()))
					.slice(0, 5),
				render: () => {
					let component: VueRenderer
					let popup: TippyInstance[]

					return {
						onStart: (suggestionProps: SuggestionProps) => {
							component = new VueRenderer(MentionList, {
								props: suggestionProps,
								editor: suggestionProps.editor
							})

							if (!suggestionProps.clientRect) return

							popup = tippy('body', {
								getReferenceClientRect: suggestionProps.clientRect as () => DOMRect,
								appendTo: () => document.body,
								content: component.element as Element,
								showOnCreate: true,
								interactive: true,
								trigger: 'manual',
								placement: 'top-start'
							})
						},
						onUpdate: (suggestionProps: SuggestionProps) => {
							component.updateProps(suggestionProps)

							if (!suggestionProps.clientRect) return

							popup[0].setProps({
								getReferenceClientRect: suggestionProps.clientRect as () => DOMRect
							})
						},
						onKeyDown: (suggestionProps: SuggestionKeyDownProps) => {
							if (suggestionProps.event.key === 'Escape') {
								popup[0].hide()
								return true
							}

							return component.ref?.onKeyDown(suggestionProps) ?? false
						},
						onExit: () => {
							popup[0].destroy()
							component.destroy()
						}
					}
				}
			}
		})
	],
	editorProps: {
		attributes: {
			class: 'post-editor__content'
		}
	},
	onUpdate: ({ editor: instance }) => {
		content.value = instance.getHTML()
	}
})

watch(content, (value) => {
	if (!editor.value || value === editor.value.getHTML()) return

	editor.value.commands.setContent(value)
})
</script>

<template>
	<PostEditorBody
		v-if="editor && !isExpanded"
		:editor="editor"
		v-model:post-type="postType"
		@toggle-expand="isExpanded = true"
	/>

	<n-modal v-model:show="isExpanded">
		<div class="post-editor-modal">
			<PostEditorBody
				v-if="editor && isExpanded"
				:editor="editor"
				expanded
				v-model:post-type="postType"
				@toggle-expand="isExpanded = false"
			/>
		</div>
	</n-modal>
</template>

<style scoped>
.post-editor-modal {
	display: flex;

	width: 90vw;
	max-width: 1100px;
	height: 80vh;

	border-radius: 16px;
	box-shadow: var(--shadow);
}
</style>

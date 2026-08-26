<script setup lang="ts">
import { NFormItem, NIcon, NInput, NSelect, NUpload } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { ImageOutline as IconImage } from '@vicons/ionicons5'
import type { GameSystem } from '@/types/mesaTypes'
import { GAME_SYSTEM_OPTIONS } from '@/constants/gameSystems'

withDefaults(defineProps<{
	displayImage: string | null
	disabled?: boolean
	gameSystemEditable?: boolean
}>(), {
	disabled: false,
	gameSystemEditable: true
})

const emit = defineEmits<{
	'image-change': [file: UploadFileInfo]
}>()

const name = defineModel<string>('name', { required: true })
const description = defineModel<string>('description', { required: true })
const lore = defineModel<string>('lore', { required: true })
const gameSystem = defineModel<GameSystem | null>('gameSystem', { default: null })
</script>

<template>
	<div class="details__body">
		<div class="details__image">
			<n-upload
				accept="image/*"
				:show-file-list="false"
				:default-upload="false"
				:disabled="disabled"
				@change="({ file }) => emit('image-change', file)"
			>
				<div class="details__image-preview" :class="{ 'details__image-preview--disabled': disabled }">
					<img v-if="displayImage" :src="displayImage" :alt="name" class="details__image-img">
					<div v-else class="details__image-placeholder">
						<n-icon size="48">
							<IconImage />
						</n-icon>
						<span>Selecionar imagem</span>
					</div>
				</div>
			</n-upload>
		</div>

		<div class="details__fields">
			<n-form-item label="Nome" path="name">
				<n-input v-model:value="name" type="text" placeholder="Ex: Elyndra Corvain" />
			</n-form-item>

			<n-form-item
				label="Sistema de jogo"
				path="gameSystem"
				:feedback="!gameSystemEditable ? 'O sistema não pode ser alterado após a criação do personagem' : undefined"
			>
				<n-select
					v-model:value="gameSystem"
					:options="GAME_SYSTEM_OPTIONS"
					:disabled="disabled || !gameSystemEditable"
					placeholder="Selecione o sistema"
				/>
			</n-form-item>

			<n-form-item label="Descrição" path="description">
				<n-input
					v-model:value="description"
					type="textarea"
					placeholder="Aparência, personalidade, trejeitos... como alguém reconheceria seu personagem em um relance?"
					:autosize="{ minRows: 4, maxRows: 8 }"
				/>
			</n-form-item>

			<n-form-item label="História" path="lore">
				<n-input
					v-model:value="lore"
					type="textarea"
					placeholder="De onde ele veio, o que já viveu, o que carrega consigo até aqui..."
					:autosize="{ minRows: 8, maxRows: 12 }"
				/>
			</n-form-item>
		</div>
	</div>
</template>

<style scoped>
.details__body {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
	align-items: start;
	justify-items: center;
}

.details__fields {
	min-width: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

@media (min-width: 860px) {
	.details__body {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: var(--space-6);
		justify-items: initial;
	}
}

.details__image :deep(.n-upload),
.details__image :deep(.n-upload-trigger) {
	width: 100%;
}

.details__image {
	width: 100%;
}

.details__image-preview {
	width: 100%;
	aspect-ratio: 3 / 4;
	border-radius: 12px;
	overflow: hidden;
	border: 1px solid var(--cor-linha);
	background: var(--cor-papel);
	cursor: pointer;
	transition: border-color 0.2s ease;
}

.details__image-preview:hover {
	border-color: var(--cor-granada);
}

.details__image-preview--disabled {
	cursor: not-allowed;
	opacity: 0.6;
}

.details__image-preview--disabled:hover {
	border-color: var(--cor-linha);
}

.details__image-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.details__image-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--space-2);
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.8rem;
}
</style>

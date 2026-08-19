<script setup lang="ts">
import { NModal, NButton, NIcon, NSpin, useDialog } from 'naive-ui'
import { ImageOutline as IconImage, CloseOutline as IconClose, PersonRemoveOutline as IconExpel, NotificationsOutline as IconNotify } from '@vicons/ionicons5'
import type { CharactersResponse } from '@/types/charactersTypes'

const props = defineProps<{
	character: CharactersResponse | null
	loading?: boolean
	canExpel?: boolean
	expelling?: boolean
	canNotify?: boolean
	notifying?: boolean
}>()

const emit = defineEmits<{
	expel: []
	notify: []
}>()

const dialog = useDialog()

const show = defineModel<boolean>('show', { required: true })

function expelButtonClick() {
	dialog.warning({
		title: 'Expulsar jogador',
		content: `Tem certeza que deseja expulsar ${props.character?.name ?? 'este jogador'} da mesa?`,
		positiveText: 'Expulsar',
		negativeText: 'Cancelar',
		onPositiveClick: () => {
			emit('expel')
		}
	})
}

function notifyButtonClick() {
	dialog.info({
		title: 'Notificar jogador',
		content: `Enviar uma notificação avisando que a mesa depende da jogada de ${props.character?.name ?? 'este jogador'}?`,
		positiveText: 'Notificar',
		negativeText: 'Cancelar',
		onPositiveClick: () => {
			emit('notify')
		}
	})
}
</script>

<template>
	<n-modal v-model:show="show">
		<div class="modal__container">
			<div class="modal__header">
				<h2 class="modal__title">
					{{ character?.name ?? 'Personagem' }}
				</h2>

				<n-button quaternary circle :focusable="false" @click="show = false">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<div v-if="loading" class="modal__center">
				<n-spin size="large" />
			</div>

			<div v-else-if="character" class="modal__form-body">
				<div class="modal__image">
					<div class="modal__image-preview">
						<img v-if="character.imageUrl" :src="character.imageUrl" :alt="character.name" class="modal__image-img">
						<div v-else class="modal__image-placeholder">
							<n-icon size="48">
								<IconImage />
							</n-icon>
						</div>
					</div>
				</div>

				<div class="modal__fields">
					<div class="modal__field">
						<span class="modal__field-label">Descrição</span>
						<p class="modal__field-text">
							{{ character.description }}
						</p>
					</div>

					<div class="modal__field">
						<span class="modal__field-label">História</span>
						<p class="modal__field-text">
							{{ character.lore }}
						</p>
					</div>
				</div>

				<div v-if="canExpel || canNotify" class="modal__actions">
					<n-button
						v-if="canNotify"
						type="warning"
						ghost
						:loading="notifying"
						:focusable="false"
						@click="notifyButtonClick"
					>
						<template #icon>
							<n-icon>
								<IconNotify />
							</n-icon>
						</template>
						Notificar jogador
					</n-button>

					<n-button
						v-if="canExpel"
						type="error"
						ghost
						:loading="expelling"
						:focusable="false"
						@click="expelButtonClick"
					>
						<template #icon>
							<n-icon>
								<IconExpel />
							</n-icon>
						</template>
						Expulsar jogador
					</n-button>
				</div>
			</div>
		</div>
	</n-modal>
</template>

<style scoped>
.modal__container {
	width: 90vw;
	max-width: 900px;
	padding: var(--space-6) var(--space-5);
	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	box-shadow: var(--shadow);
}

.modal__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: var(--space-5);
}

.modal__title {
	color: var(--cor-granada);
}

.modal__center {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
}

.modal__form-body {
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
	align-items: start;
}

.modal__actions {
	width: 100%;
	display: flex;
	justify-content: flex-end;
	gap: var(--space-3);
	padding-top: var(--space-4);
	border-top: 1px solid var(--cor-linha);
}

.modal__fields {
	min-width: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.modal__field {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.modal__field-label {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.03em;
}

.modal__field-text {
	color: var(--cor-tinta);
	font-family: var(--font-serif);
	font-size: 0.95rem;
	line-height: 1.6;
	white-space: pre-wrap;
}

.modal__image {
	width: 100%;
}

.modal__image-preview {
	width: 100%;
	max-width: 320px;
	margin-inline: auto;
	aspect-ratio: 3 / 4;
	border-radius: 12px;
	overflow: hidden;
	border: 1px solid var(--cor-linha);
	background: var(--cor-papel);
}

.modal__image-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.modal__image-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--cor-tinta-fraca);
}

@media (min-width: 860px) {
	.modal__form-body {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: var(--space-6);
		justify-items: initial;
	}

	.modal__actions {
		grid-column: 1 / -1;
	}
}
</style>

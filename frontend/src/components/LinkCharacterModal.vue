<script setup lang="ts">
import { NModal, NButton, NIcon, NSpin, NEmpty } from 'naive-ui'
import { CloseOutline as IconClose, PersonOutline as IconPerson } from '@vicons/ionicons5'
import type { CharactersResponse } from '@/types/charactersTypes'

withDefaults(defineProps<{
	characters: CharactersResponse[]
	loading?: boolean
	linkingId?: number | null
}>(), {
	loading: false,
	linkingId: null
})

const emit = defineEmits<{
	link: [characterId: number]
}>()

const show = defineModel<boolean>('show', { required: true })
</script>

<template>
	<n-modal v-model:show="show">
		<div class="modal__container">
			<div class="modal__header">
				<h2 class="modal__title">
					Vincular personagem
				</h2>

				<n-button quaternary circle :focusable="false" @click="show = false">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<div v-if="loading" class="center__container">
				<n-spin size="large" />
			</div>

			<n-empty
				v-else-if="!characters.length"
				description="Nenhum personagem disponível para vincular. Crie um personagem do sistema desta mesa em Meus Personagens ou desvincule um já usado em outra mesa."
				class="center__container"
			/>

			<div v-else class="list">
				<div v-for="char of characters" :key="char.id" class="char-row">
					<div class="char-row__info">
						<div class="char-row__avatar">
							<img v-if="char.imageUrl" :src="char.imageUrl" :alt="char.name" class="char-row__avatar-img">
							<n-icon v-else>
								<IconPerson />
							</n-icon>
						</div>

						<span class="char-row__nome">{{ char.name }}</span>
					</div>

					<n-button
						size="small"
						type="primary"
						secondary
						:disabled="linkingId !== null"
						:loading="linkingId === char.id"
						:focusable="false"
						@click="emit('link', char.id)"
					>
						Vincular
					</n-button>
				</div>
			</div>
		</div>
	</n-modal>
</template>

<style scoped>
.modal__container {
	width: 90vw;
	max-width: 420px;
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

.center__container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 160px;
}

.list {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	max-height: 400px;
	overflow-y: auto;
}

.char-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-3);

	padding: var(--space-2) var(--space-3);
	border-radius: 10px;
	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
}

.char-row__info {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	min-width: 0;
}

.char-row__avatar {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	height: 32px;
	width: 32px;

	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 50%;
	color: var(--cor-tinta-fraca);
	font-size: 0.9rem;

	overflow: hidden;
}

.char-row__avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.char-row__nome {
	font-family: var(--font-sans);
	font-size: 0.9rem;
	color: var(--cor-tinta);

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>

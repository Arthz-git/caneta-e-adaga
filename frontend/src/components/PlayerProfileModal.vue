<script setup lang="ts">
import { NModal, NButton, NIcon } from 'naive-ui'
import { CloseOutline as IconClose, PersonOutline as IconPerson } from '@vicons/ionicons5'

const ROLE_LABELS = {
	MASTER: 'Mestre',
	PLAYER: 'Jogador',
	SPECTATOR: 'Espectador'
}

defineProps<{
	player: { name: string, role: 'MASTER' | 'PLAYER' | 'SPECTATOR' } | null
}>()

const show = defineModel<boolean>('show', { required: true })
</script>

<template>
	<n-modal v-model:show="show">
		<div class="modal__container">
			<div class="modal__header">
				<h2 class="modal__title">
					Jogador
				</h2>

				<n-button quaternary circle :focusable="false" @click="show = false">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<div v-if="player" class="profile__body">
				<div class="profile__avatar">
					<n-icon>
						<IconPerson />
					</n-icon>
				</div>

				<span class="profile__name">
					{{ player.name }}
				</span>

				<span class="profile__role">
					{{ ROLE_LABELS[player.role] }}
				</span>
			</div>
		</div>
	</n-modal>
</template>

<style scoped>
.modal__container {
	width: 90vw;
	max-width: 360px;
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

.profile__body {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-2);
	padding-bottom: var(--space-2);
}

.profile__avatar {
	display: flex;
	justify-content: center;
	align-items: center;

	height: 72px;
	width: 72px;

	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
	border-radius: 50%;
	color: var(--cor-tinta-fraca);
	font-size: 1.8rem;
}

.profile__name {
	font-family: var(--font-serif);
	color: var(--cor-tinta);
	font-size: 1.1rem;
	font-weight: 600;
}

.profile__role {
	font-family: var(--font-sans);
	color: var(--cor-tinta-fraca);
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.03em;
}
</style>

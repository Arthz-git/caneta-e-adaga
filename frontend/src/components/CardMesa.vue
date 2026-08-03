<script setup lang="ts">
import type { MesaResponse } from '@/types/mesaTypes'
import { NButton, NIcon, NTooltip } from 'naive-ui'
import {
	PeopleOutline as IconUsers,
	EyeOutline as IconEye,
	LockClosedOutline as IconLocked,
	LockOpenOutline as IconUnlocked,
	ImageOutline as IconImage,
	LogInOutline as IconEnter,
	CalendarOutline as IconCalendar
} from '@vicons/ionicons5'
import { formatDateIntoString } from '@/composables/transformDateIntoString'

defineProps<{
	mesa: MesaResponse
	isOwner: boolean
	onCardClick: (payload: MouseEvent) => void
}>()
</script>

<template>
	<div class="card__mesa card-base card-base--clickable" @click="onCardClick">
		<div class="card__mesa__badge" v-if="isOwner">
			Sua mesa
		</div>

		<div class="card-base__header">
			<div class="card-base__avatar card-base__avatar--square">
				<img v-if="mesa.imageUrl" :src="mesa.imageUrl" :alt="mesa.title" class="card-base__avatar-img">
				<n-icon v-else>
					<IconImage />
				</n-icon>
			</div>

			<div class="card-base__data">
				<p class="card-base__title">
					{{ mesa.title }}
				</p>

				<p class="card__mesa__subtitle card-base__clamp-2">"
					{{ mesa.description }}"
				</p>
			</div>
		</div>

		<div class="card__mesa__info">
			<n-tooltip trigger="hover" placement="bottom">
				<template #trigger>
					<div class="info__item">
						<n-icon>
							<IconUsers />
						</n-icon>
						<span>{{ mesa.countPlayers }}/{{ mesa.maxPlayers }}</span>
					</div>
				</template>
				Jogadores
			</n-tooltip>

			<n-tooltip trigger="hover" placement="bottom" v-if="mesa.allowSpectators">
				<template #trigger>
					<div class="info__item">
						<n-icon>
							<IconEye />
						</n-icon>
						<span>{{ mesa.countSpectators }}</span>
					</div>
				</template>
				Espectadores
			</n-tooltip>

			<n-tooltip trigger="hover" placement="bottom">
				<template #trigger>
					<div class="info__item">
						<n-icon>
							<IconLocked v-if="mesa.isPrivate" />
							<IconUnlocked v-else />
						</n-icon>
						<span>{{ mesa.isPrivate ? 'Priv' : 'Pub' }}</span>
					</div>
				</template>
				{{ mesa.isPrivate ? 'Mesa privada' : 'Mesa pública' }}
			</n-tooltip>

			<n-tooltip trigger="hover" placement="bottom">
				<template #trigger>
					<div class="info__item">
						<n-icon>
							<IconCalendar />
						</n-icon>
						<span>{{ formatDateIntoString(mesa.createdAt, 'dd/MM/yyyy') }}</span>
					</div>
				</template>
				Mesa criada em {{ formatDateIntoString(mesa.createdAt) }}
			</n-tooltip>
		</div>

		<div class="card-base__actions">
			<n-tooltip trigger="hover" placement="bottom">
				<template #trigger>
					<n-button
						circle
						quaternary
						:focusable="false"
					>
						<template #icon>
							<n-icon>
								<IconEnter />
							</n-icon>
						</template>
					</n-button>
				</template>
				{{ mesa.isPrivate ? 'Solicitar entrada' : 'Entrar na mesa' }}
			</n-tooltip>
		</div>
	</div>
</template>

<style scoped>
.card__mesa:has(.card__mesa__badge) {
	border-color: var(--cor-latao);
}

.card__mesa__badge {
	position: absolute;
	top: 0;
	right: var(--space-4);
	transform: translateY(-50%);

	padding: 2px var(--space-2);
	border-radius: 999px;
	background: var(--cor-latao);
	border: 1px solid var(--cor-linha);

	font-family: var(--font-sans);
	font-size: 0.65rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	color: var(--cor-papel-elevado);
}

.card__mesa__subtitle {
	font-family: var(--font-serif);
	color: var(--cor-tinta);
	font-size: 0.9rem;
	font-style: italic;
}

.card__mesa__info {
	display: flex;
	align-items: center;
	gap: var(--space-4);
}

.info__item {
	display: flex;
	align-items: center;
	gap: var(--space-1);

	font-family: var(--font-sans);
	font-size: 0.85rem;
	color: var(--cor-tinta-fraca);
}
</style>

<script setup lang="ts">
import type { CharactersResponse } from '@/types/charactersTypes'
import { NButton, NIcon, NTooltip } from 'naive-ui'
import {
	PersonOutline as IconUser,
	CreateOutline as IconEdit,
	TrashBinOutline as IconTrash,
	LinkOutline as IconMesa
} from '@vicons/ionicons5'

defineProps<{
	char: CharactersResponse
}>()

const emit = defineEmits<{
	edit: [charId: number]
	delete: [charId: number]
}>()
</script>

<template>
	<div class="card-base" @click.prevent="emit('edit', char.id)">
		<div class="card-base__header">
			<div class="card-base__avatar card-base__avatar--round">
				<img v-if="char.imageUrl" :src="char.imageUrl" :alt="char.name" class="card-base__avatar-img">
				<n-icon v-else>
					<IconUser />
				</n-icon>
			</div>

			<div class="card-base__data">
				<p class="card-base__title">
					{{ char.name }}
				</p>

				<p class="card__description card-base__clamp-2">
					{{ char.description }}
				</p>

				<n-tooltip trigger="hover" placement="bottom" v-if="char.linkedMesaTitle">
					<template #trigger>
						<div class="info__item">
							<n-icon>
								<IconMesa />
							</n-icon>
							<span>{{ char.linkedMesaTitle }}</span>
						</div>
					</template>
					Vinculado à mesa "{{ char.linkedMesaTitle }}"
				</n-tooltip>
			</div>
		</div>

		<div class="card-base__actions">
			<n-tooltip
				trigger="hover"
				placement="bottom"
			>
				<template #trigger>
					<n-button
						circle
						quaternary
						@click.prevent="emit('edit', char.id)"
						:focusable="false"
					>
						<template #icon>
							<n-icon>
								<IconEdit />
							</n-icon>
						</template>
					</n-button>
				</template>
				Editar
			</n-tooltip>

			<n-tooltip
				trigger="hover"
				placement="bottom"
			>
				<template #trigger>
					<n-button
						circle
						quaternary
						@click.prevent="emit('delete', char.id)"
						:focusable="false"
					>
						<template #icon>
							<n-icon>
								<IconTrash />
							</n-icon>
						</template>
					</n-button>
				</template>
				Excluir
			</n-tooltip>
		</div>
	</div>
</template>

<style scoped>
.card__description {
	font-family: var(--font-sans);
	color: var(--cor-tinta-fraca);
	font-size: 0.75rem;
}

.info__item {
	display: flex;
	align-items: center;
	gap: var(--space-1);
	margin-top: var(--space-2);

	font-family: var(--font-sans);
	font-size: 0.75rem;
	color: var(--cor-tinta-fraca);
}
</style>

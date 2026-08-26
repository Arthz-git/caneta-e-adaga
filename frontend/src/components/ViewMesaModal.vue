<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { MesaResponse } from '@/types/mesaTypes'
import {
	ImageOutline as IconImage,
	CloseOutline as IconClose,
	PeopleOutline as IconUsers,
	EyeOutline as IconEye,
	LockClosedOutline as IconLocked,
	LockOpenOutline as IconUnlocked,
	CalendarOutline as IconCalendar,
	DiceOutline as IconGameSystem
} from '@vicons/ionicons5'
import { formatDateIntoString } from '@/composables/transformDateIntoString'
import { GAME_SYSTEM_LABELS } from '@/constants/gameSystems'
import { NButton, NIcon, NModal, useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/useAuth'
import { useRouter } from 'vue-router'
import { createSolicitacaoMesa, getMySolicitacaoByMesaId } from '@/services/solicitacao.service'

const router = useRouter()
const auth = useAuthStore()
const message = useMessage()

const isMember = ref<boolean | null>(null)

const pendingSolicitacao = ref({
	espectador: false,
	jogador: false
})

const props = defineProps<{
	show: boolean
	mesa: MesaResponse | null
}>()

const emit = defineEmits<{
	'update:show': [value: boolean]
}>()

function close() {
	emit('update:show', false)
	isMember.value = null
}

const needsRequest = computed(() =>
	!!props.mesa?.isPrivate &&
	props.mesa.isMember === false &&
	props.mesa.creator.id !== auth.user?.id
)

watch(
	() => [props.show, props.mesa?.id],
	async ([show]) => {
		if (!show || !props.mesa || !needsRequest.value) {
			pendingSolicitacao.value = { espectador: false, jogador: false }
			return
		}

		try {
			const solicitacoes = await getMySolicitacaoByMesaId(props.mesa.id)

			pendingSolicitacao.value = {
				espectador: solicitacoes.some(s => s.motivo === 'PEDIDO_ENTRADA_MESA_ESPECTADOR' && s.status === 'PENDENTE'),
				jogador: solicitacoes.some(s => s.motivo === 'PEDIDO_ENTRADA_MESA_JOGADOR' && s.status === 'PENDENTE')
			}
		}
		catch {
			pendingSolicitacao.value = { espectador: false, jogador: false }
		}
	}
)

function handleEntrarButtonClick(mesaId: number) {
	router.push({
		name: 'mesa',
		params: { mesaId }
	})
}

async function handleSolicitarEspectador(mesaId: number) {
	if (props.mesa) {
		try {
			await createSolicitacaoMesa({
				destinoId: props.mesa.creator.id,
				mesaId: mesaId,
				motivo: 'PEDIDO_ENTRADA_MESA_ESPECTADOR'
			})

			message.success('Sua solicitação foi encaminhada')
			pendingSolicitacao.value.espectador = true
		}
		catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
			message.error(errorMessage)
		}
	}
}

async function handleSolicitarJogador(mesaId: number) {
	if (props.mesa) {
		try {
			await createSolicitacaoMesa({
				destinoId: props.mesa.creator.id,
				mesaId: mesaId,
				motivo: 'PEDIDO_ENTRADA_MESA_JOGADOR'
			})

			message.success('Sua solicitação foi encaminhada')
			pendingSolicitacao.value.jogador = true
		}
		catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
			message.error(errorMessage)
		}
	}
}
</script>

<template>
	<n-modal
		:show="props.show"
		@update:show="value => emit('update:show', value)"
	>
		<div class="modal__container view__container" v-if="props.mesa">
			<div class="modal__header">
				<h2 class="modal__title">
					{{ props.mesa.title }}
				</h2>

				<n-button quaternary circle :focusable="false" @click="close">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<div class="view__body">
				<div class="view__image">
					<img v-if="props.mesa.imageUrl" :src="props.mesa.imageUrl" :alt="props.mesa.title" class="view__image-img">
					<div v-else class="view__image-placeholder">
						<n-icon size="48">
							<IconImage />
						</n-icon>
					</div>
				</div>

				<div class="view__fields">
					<div class="view__field">
						<span class="view__label">Descrição</span>
						<p class="view__description">{{ props.mesa.description }}</p>
					</div>

					<div class="view__field">
						<span class="view__label">Criador</span>
						<p>{{ props.mesa.creator.name }}</p>
					</div>

					<div class="view__info">
						<div class="info__item">
							<n-icon>
								<IconGameSystem />
							</n-icon>
							<span>{{ GAME_SYSTEM_LABELS[props.mesa.gameSystem] }}</span>
						</div>

						<div class="info__item">
							<n-icon>
								<IconUsers />
							</n-icon>
							<span>{{ props.mesa.countPlayers }}/{{ props.mesa.maxPlayers }} jogadores</span>
						</div>

						<div class="info__item" v-if="props.mesa.allowSpectators">
							<n-icon>
								<IconEye />
							</n-icon>
							<span>{{ props.mesa.countSpectators }} espectadores</span>
						</div>

						<div class="info__item">
							<n-icon>
								<IconLocked v-if="props.mesa.isPrivate" />
								<IconUnlocked v-else />
							</n-icon>
							<span>{{ props.mesa.isPrivate ? 'Mesa privada' : 'Mesa pública' }}</span>
						</div>

						<div class="info__item">
							<n-icon>
								<IconCalendar />
							</n-icon>
							<span>Criada em {{ formatDateIntoString(props.mesa.createdAt) }}</span>
						</div>
					</div>
				</div>

				<div class="request-actions" v-show="needsRequest">
					<span class="view__label">Solicitar entrada como</span>

					<div class="request-actions__buttons">
						<div class="request-actions__button">
							<n-button
								type="primary"
								attr-type="submit"
								block
								strong
								:disabled="pendingSolicitacao.espectador"
								:focusable="false"
								@click.prevent="() => handleSolicitarEspectador(props.mesa!.id)"
							>
								Espectador
							</n-button>

							<span class="request-actions__hint" v-if="pendingSolicitacao.espectador">
								Solicitação pendente
							</span>
						</div>

						<div class="request-actions__button">
							<n-button
								type="primary"
								attr-type="submit"
								block
								strong
								:disabled="pendingSolicitacao.jogador"
								:focusable="false"
								@click.prevent="() => handleSolicitarJogador(props.mesa!.id)"
							>
								Jogador
							</n-button>

							<span class="request-actions__hint" v-if="pendingSolicitacao.jogador">
								Solicitação pendente
							</span>
						</div>
					</div>
				</div>

				<n-button
					type="primary"
					attr-type="submit"
					block
					strong
					:focusable="false"
					@click.prevent="() => handleEntrarButtonClick(props.mesa!.id)"
					v-show="!needsRequest"
				>
					Entrar
				</n-button>
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

.view__container {
	max-width: 640px;
}

.view__body {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.view__image {
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: 12px;
	overflow: hidden;
	border: 1px solid var(--cor-linha);
	background: var(--cor-papel);
}

.view__image-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.view__image-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--cor-tinta-fraca);
}

.view__fields {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.view__field {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.view__label {
	font-family: var(--font-sans);
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	color: var(--cor-tinta-fraca);
}

.view__description {
	font-family: var(--font-serif);
	font-style: italic;
	color: var(--cor-tinta);
	font-size: 1rem;
	max-height: 240px;
	overflow: auto;
}

.view__info {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-4);
}

.info__item {
	display: flex;
	align-items: center;
	gap: var(--space-1);

	font-family: var(--font-sans);
	font-size: 0.75rem;
	color: var(--cor-tinta-fraca);
}

.request-actions {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.request-actions__buttons {
	display: flex;
	gap: var(--space-3);
}

.request-actions__button {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.request-actions__hint {
	font-family: var(--font-sans);
	font-size: 0.7rem;
	color: var(--cor-tinta-fraca);
	text-align: center;
}
</style>

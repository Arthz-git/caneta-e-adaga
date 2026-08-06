<script setup lang="ts">
import { getMesaInfo } from '@/services/mesas.service'
import type { GetMesaInfoResponse } from '@/types/mesaTypes'
import {
	useMessage,
	NIcon,
	NButton
} from 'naive-ui'
import { computed, ref } from 'vue'
import {
	ArrowBackOutline as IconBack,
	ImageOutline as IconImage,
	SettingsOutline as IconSettings
} from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import MesaFormModal from '@/components/MesaFormModal.vue'

// ----------------------------------------------------------------------

const props = defineProps<{
	mesaId: string
}>()

const router = useRouter()
const message = useMessage()
const auth = useAuthStore()

const mesa = ref<GetMesaInfoResponse | null>(null)
const isLoadingMesa = ref(false)
const showModalConfigMesa = ref(false)
const mesaImage = ref<File | null>(null)

const isOwnerMesa = computed(() => mesa.value?.createdBy === auth.user?.id)

function backButtonClick() {
	router.back()
}

function configButtonClick() {
	showModalConfigMesa.value = true
}

async function getMesa() {
	try {
		isLoadingMesa.value = true

		const mesaResponse = await getMesaInfo(Number(props.mesaId))

		mesa.value = mesaResponse
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoadingMesa.value = false
	}
}

getMesa()
</script>

<template>
	<div class="main__mesa">
		<div class="header">
			<n-button
				circle
				quaternary
				:focusable="false"
				aria-label="Voltar"
				@click.prevent="backButtonClick"
			>
				<template #icon>
					<n-icon>
						<IconBack />
					</n-icon>
				</template>
			</n-button>

			<div class="header__avatar">
				<img v-if="mesa?.imageUrl" :src="mesa.imageUrl" :alt="mesa.title" class="header__avatar-img">
				<n-icon v-else>
					<IconImage />
				</n-icon>
			</div>

			<div class="header__data">
				<p class="header__title">
					{{ mesa?.title }}
				</p>
				<p class="header__creator">
					Mestrado por 
					<strong>
						{{ mesa?.creator.name }}
					</strong>
				</p>
			</div>

			<div class="header__spacer" />

			<n-button
				circle
				quaternary
				:focusable="false"
				aria-label="Configurações da mesa"
				@click.prevent="configButtonClick"
			>
				<template #icon>
					<n-icon>
						<IconSettings />
					</n-icon>
				</template>
			</n-button>
		</div>

		<MesaFormModal
			v-if="mesa"
			v-model:show="showModalConfigMesa"
			v-model:title="mesa.title"
			v-model:description="mesa.description"
			v-model:max-players="mesa.maxPlayers"
			v-model:is-private="mesa.isPrivate"
			v-model:allow-spectators="mesa.allowSpectators"
			v-model:image="mesaImage"
			heading="Configurações da mesa"
			submit-label="Salvar alterações"
			:image-url="mesa.imageUrl"
			:disabled="!isOwnerMesa"
			:show-submit-button="isOwnerMesa"
		/>

		<div class="left__panel">
			<p>
				left-panel
			</p>
		</div>

		<div class="right__panel">
			<p>
				right-panel
			</p>
		</div>

		<div class="mid__container">
			<p>
				mid-container
			</p>
		</div>
		
		<div class="bottom__input">
			<p>
				bottom-input
			</p>
		</div>
	</div>
</template>

<style scoped>
.main__mesa {
	display: grid;
	grid-template-areas:
		'header header header'
		'left__panel mid__container right__panel'
		'left__panel bottom__input right__panel'
	;
	grid-template-columns: 1fr 3fr 1fr;
	grid-template-rows: 80px 1fr 80px;
	height: 100%;

	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.header {
	grid-area: header;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: var(--space-3);

	padding-inline: var(--space-4);
	border-bottom: 1px solid var(--cor-linha);
}

.header__avatar {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	height: 48px;
	width: 48px;

	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
	border-radius: 12px;
	color: var(--cor-latao);
	font-size: 1.4rem;

	overflow: hidden;
}

.header__avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.header__data {
	min-width: 0;
}

.header__title {
	font-family: var(--font-serif);
	color: var(--cor-granada);
	font-size: 1.1rem;
	font-weight: 600;
	line-height: 1.2;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.header__creator {
	font-family: var(--font-sans);
	color: var(--cor-tinta-fraca);
	font-size: 0.8rem;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.header__spacer {
	flex: 1;
}

.left__panel {
	grid-area: left__panel;
	display: flex;
	justify-content: center;
	align-items: center;

	/* background-color: #533DC7; */
}

.right__panel {
	grid-area: right__panel;
	display: flex;
	justify-content: center;
	align-items: center;

	/* background-color: #DEC1E9; */
}

.mid__container {
	grid-area: mid__container;
	display: flex;
	justify-content: center;
	align-items: center;

	/* background-color: #399831; */
}

.bottom__input {
	grid-area: bottom__input;
	display: flex;
	justify-content: center;
	align-items: center;

	/* background-color: #85CCB3; */
}

</style>
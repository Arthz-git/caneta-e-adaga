<script setup lang="ts">
import { getMesaInfo, updateMesa } from '@/services/mesas.service'
import { getCharacterById } from '@/services/characters.service'
import { createPlayer, deletePlayer, notifyPlayer } from '@/services/players.service'
import type { GetMesaInfoResponse } from '@/types/mesaTypes'
import type { CharactersResponse } from '@/types/charactersTypes'
import {
	useMessage,
	useDialog,
	NIcon,
	NButton,
	NSpin
} from 'naive-ui'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
	ArrowBackOutline as IconBack,
	ImageOutline as IconImage,
	SettingsOutline as IconSettings,
	PersonOutline as IconPerson,
	AddOutline as IconAdd,
	SendOutline as IconSend,
	RefreshOutline as IconRefresh,
	EyeOutline as IconEye,
	PersonRemoveOutline as IconExpel
} from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import CharacterSummaryModal from '@/components/CharacterSummaryModal.vue'
import InviteModal from '@/components/InviteModal.vue'
import MesaFormModal from '@/components/MesaFormModal.vue'
import PostEditor from '@/components/PostEditor.vue'
import PostsTimeline from '@/components/PostsTimeline.vue'
import SideChatPanel from '@/components/SideChatPanel.vue'
import SidePanel from '@/components/SidePanel.vue'
import { createPost } from '@/services/posts.service'
import type { PostListItem, PostType } from '@/types/postTypes'
import { formatDateIntoString } from '@/composables/transformDateIntoString'

const PLAYER_ALLOWED_POST_TYPES: PostType[] = ['CHARACTER', 'OOC']
const SPECTATOR_ALLOWED_POST_TYPES: PostType[] = ['OOC']
const AUTO_REFRESH_INTERVAL_MS = 60_000

// ----------------------------------------------------------------------

const props = defineProps<{
	mesaId: string
}>()

const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const auth = useAuthStore()

const mesa = ref<GetMesaInfoResponse | null>(null)
const isLoadingMesa = ref(false)
const showModalConfigMesa = ref(false)
const isSavingMesaConfig = ref(false)
const mesaImage = ref<File | null>(null)
const mesaConfigForm = reactive({
	title: '',
	description: '',
	maxPlayers: 1,
	isPrivate: false,
	allowSpectators: true
})
const postMessage = ref('')
const postMessageType = ref<PostType>('NARRATOR')
const postVisiblePlayerIds = ref<number[]>([])
const isSendingPost = ref(false)
const isRightPanelCollapsed = ref(true)
const postsTimeline = ref<InstanceType<typeof PostsTimeline> | null>(null)
const posts = ref<PostListItem[]>([])
const showCharacterModal = ref(false)
const isLoadingCharacter = ref(false)
const selectedCharacter = ref<CharactersResponse | null>(null)
const selectedPlayerId = ref<number | null>(null)
const isExpellingPlayer = ref(false)
const isJoiningAsSpectator = ref(false)
const expellingSpectatorId = ref<number | null>(null)
const isNotifyingPlayer = ref(false)
const showInviteFriendModal = ref(false)
const lastUpdatedAt = ref(new Date())
let autoRefreshIntervalId: ReturnType<typeof setInterval> | null = null

// #region computeds
const isPostMessageEmpty = computed(() => !postMessage.value.replace(/<[^>]*>/g, '').trim())

const isOwnerMesa = computed(() => mesa.value?.createdBy === auth.user?.id)
const mestre = computed(() => mesa.value?.players.find(player => player.role === 'MASTER'))
const jogadores = computed(() => mesa.value?.players.filter(player => player.role === 'PLAYER') ?? [])
const targetablePlayers = computed(() => (
	mesa.value?.players
		.filter(player => player.role !== 'SPECTATOR')
		.filter(player => player.userId !== auth.user?.id)
		.map(player => ({
			id: player.id,
			name: player.role === 'MASTER' ? `${player.user.name} (Mestre)` : player.user.name
		})) ?? []
))
const vagasLivres = computed(() => Math.max(mesa.value!.maxPlayers - occupiedPlayerSlots.value, 0))
const mesaMemberUserIds = computed(() => mesa.value?.players.map(player => player.userId) ?? [])
const espectadores = computed(() => mesa.value?.players.filter(player => player.role === 'SPECTATOR') ?? [])
const occupiedPlayerSlots = computed(() => mesa.value?.players.filter(player => player.role !== 'SPECTATOR').length ?? 1)
const currentPlayer = computed(() => mesa.value?.players.find(player => player.userId === auth.user?.id))
const isMesaMember = computed(() => !!currentPlayer.value)
const canJoinAsSpectator = computed(() => !isMesaMember.value && !!mesa.value?.allowSpectators)
const selectedPlayer = computed(() => mesa.value?.players.find(player => player.id === selectedPlayerId.value))
const canManageSelectedPlayer = computed(() => (
	isOwnerMesa.value && !!selectedPlayer.value && selectedPlayer.value.userId !== auth.user?.id
))
const allowedPostTypes = computed<PostType[]>(() => {
	if (currentPlayer.value?.role === 'PLAYER') return PLAYER_ALLOWED_POST_TYPES
	if (currentPlayer.value?.role === 'SPECTATOR') return SPECTATOR_ALLOWED_POST_TYPES
	return ['NARRATOR', 'CHARACTER', 'NPC', 'SYSTEM', 'OOC']
})
const sideChatPosts = computed(() => posts.value.filter(post => post.type === 'OOC' || post.type === 'SYSTEM'))
const mentionItems = computed(() => {
	const names = mesa.value?.players.flatMap(player => [player.user.name, player.userCharacter?.name]) ?? []

	return [...new Set(names.filter((name): name is string => Boolean(name)))]
})
//#endregion

function backButtonClick() {
	router.back()
}

function vagaLivreClick() {
	showInviteFriendModal.value = true
}

function configButtonClick() {
	if (!mesa.value) return

	mesaConfigForm.title = mesa.value.title
	mesaConfigForm.description = mesa.value.description
	mesaConfigForm.maxPlayers = mesa.value.maxPlayers
	mesaConfigForm.isPrivate = mesa.value.isPrivate
	mesaConfigForm.allowSpectators = mesa.value.allowSpectators
	mesaImage.value = null

	showModalConfigMesa.value = true
}

async function playerCardClick(playerId: number, userCharacterId: number | null) {
	if (!userCharacterId) return

	try {
		selectedPlayerId.value = playerId
		showCharacterModal.value = true
		isLoadingCharacter.value = true

		selectedCharacter.value = await getCharacterById(userCharacterId)
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar o personagem. Tente novamente.'
		message.error(errorMessage)
		showCharacterModal.value = false
	}
	finally {
		isLoadingCharacter.value = false
	}
}

async function expelSelectedPlayer() {
	if (!selectedPlayerId.value || isExpellingPlayer.value) return

	try {
		isExpellingPlayer.value = true

		await deletePlayer(selectedPlayerId.value)

		message.success('Jogador expulso da mesa com sucesso')
		showCharacterModal.value = false
		await getMesa()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível expulsar o jogador. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isExpellingPlayer.value = false
	}
}

async function notifySelectedPlayer() {
	if (!selectedPlayerId.value || isNotifyingPlayer.value) return

	try {
		isNotifyingPlayer.value = true

		await notifyPlayer(selectedPlayerId.value)

		message.success('Jogador notificado com sucesso')
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível notificar o jogador. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isNotifyingPlayer.value = false
	}
}

function expelSpectatorClick(spectatorId: number, spectatorName: string) {
	if (expellingSpectatorId.value) return

	dialog.warning({
		title: 'Expulsar espectador',
		content: `Tem certeza que deseja expulsar ${spectatorName} da mesa?`,
		positiveText: 'Expulsar',
		negativeText: 'Cancelar',
		onPositiveClick: async () => {
			try {
				expellingSpectatorId.value = spectatorId

				await deletePlayer(spectatorId)

				message.success('Espectador expulso da mesa com sucesso')
				await getMesa()
			}
			catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Não foi possível expulsar o espectador. Tente novamente.'
				message.error(errorMessage)
			}
			finally {
				expellingSpectatorId.value = null
			}
		}
	})
}

async function joinAsSpectatorClick() {
	if (!mesa.value || !auth.user || isJoiningAsSpectator.value) return

	try {
		isJoiningAsSpectator.value = true

		await createPlayer({
			userId: auth.user.id,
			mesaId: mesa.value.id,
			role: 'SPECTATOR',
			userCharacterId: null
		})

		message.success('Você entrou na mesa como espectador')
		await getMesa()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível entrar como espectador. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isJoiningAsSpectator.value = false
	}
}

async function mesaConfigSubmit() {
	if (!mesa.value || isSavingMesaConfig.value) return

	try {
		isSavingMesaConfig.value = true

		const updatedMesa = await updateMesa({
			id: mesa.value.id,
			...mesaConfigForm,
			image: mesaImage.value ?? undefined
		})

		mesa.value = { ...mesa.value, ...updatedMesa }
		showModalConfigMesa.value = false

		message.success('Mesa alterada com sucesso')
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível salvar as alterações. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isSavingMesaConfig.value = false
	}
}

async function sendPostButtonClick() {
	if (isPostMessageEmpty.value || isSendingPost.value) return

	try {
		isSendingPost.value = true

		const isMesaUpToDate = await postsTimeline.value?.isUpToDate()
		if (isMesaUpToDate === false) {
			message.warning('A mesa não está 100% atualizada. Novas mensagens podem ter chegado, recarregue antes de continuar.')
			await postsTimeline.value?.reload()
			return
		}

		await createPost({
			mesaId: Number(props.mesaId),
			text: postMessage.value,
			type: postMessageType.value,
			visiblePlayerIds: postVisiblePlayerIds.value.length ? postVisiblePlayerIds.value : undefined
		})

		postMessage.value = ''
		postVisiblePlayerIds.value = []
		await postsTimeline.value?.reload()
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível enviar a mensagem. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isSendingPost.value = false
	}
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

async function refreshMesaData() {
	const isMesaUpToDate = await postsTimeline.value?.isUpToDate()
	if (isMesaUpToDate === false) {
		await postsTimeline.value?.reload()
	}

	lastUpdatedAt.value = new Date()
}

function startAutoRefresh() {
	if (autoRefreshIntervalId) return
	autoRefreshIntervalId = setInterval(refreshMesaData, AUTO_REFRESH_INTERVAL_MS)
}

function stopAutoRefresh() {
	if (!autoRefreshIntervalId) return
	clearInterval(autoRefreshIntervalId)
	autoRefreshIntervalId = null
}

function handleVisibilityChange() {
	if (document.hidden) stopAutoRefresh()
	else startAutoRefresh()
}

watch(allowedPostTypes, (types) => {
	if (!types.includes(postMessageType.value)) {
		postMessageType.value = types[0]
	}
}, { immediate: true })

onMounted(() => {
	document.addEventListener('visibilitychange', handleVisibilityChange)
	if (!document.hidden) startAutoRefresh()
})

onUnmounted(() => {
	document.removeEventListener('visibilitychange', handleVisibilityChange)
	stopAutoRefresh()
})

getMesa()
</script>

<template>
	<div
		class="main__mesa center__container"
		v-if="isLoadingMesa"
	>
		<n-spin size="large" />
	</div>

	<div v-else-if="mesa" class="main__mesa">
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
				<img v-if="mesa.imageUrl" :src="mesa.imageUrl" :alt="mesa.title" class="header__avatar-img">
				<n-icon v-else>
					<IconImage />
				</n-icon>
			</div>

			<div class="header__data">
				<p class="header__title">
					{{ mesa.title }}
				</p>
				
				<p class="header__creator">
					Mestrado por

					<strong>
						{{ mesa.creator.name }}
					</strong>
				</p>
			</div>

			<div class="header__spacer" />

			<span
				class="header__last-update"
				role="button"
				tabindex="0"
				title="Clique para atualizar agora"
				@click="refreshMesaData"
				@keydown.enter="refreshMesaData"
			>
				<n-icon class="header__last-update-icon">
					<IconRefresh />
				</n-icon>

				Atualizado às {{ formatDateIntoString(lastUpdatedAt, 'HH:mm:ss') }}
			</span>

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
			v-model:title="mesaConfigForm.title"
			v-model:description="mesaConfigForm.description"
			v-model:max-players="mesaConfigForm.maxPlayers"
			v-model:is-private="mesaConfigForm.isPrivate"
			v-model:allow-spectators="mesaConfigForm.allowSpectators"
			v-model:image="mesaImage"
			heading="Configurações da mesa"
			submit-label="Salvar alterações"
			:image-url="mesa.imageUrl"
			:disabled="!isOwnerMesa"
			:show-submit-button="isOwnerMesa"
			:loading="isSavingMesaConfig"
			:min-players="occupiedPlayerSlots"
			:spectators-toggle-disabled="espectadores.length > 0"
			@submit="mesaConfigSubmit"
		/>

		<CharacterSummaryModal
			v-model:show="showCharacterModal"
			:character="selectedCharacter"
			:loading="isLoadingCharacter"
			:can-expel="canManageSelectedPlayer"
			:expelling="isExpellingPlayer"
			:can-notify="canManageSelectedPlayer"
			:notifying="isNotifyingPlayer"
			@expel="expelSelectedPlayer"
			@notify="notifySelectedPlayer"
		/>

		<InviteModal
			v-model:show="showInviteFriendModal"
			:mesa-id="Number(mesaId)"
			:excluded-user-ids="mesaMemberUserIds"
		/>

		<div class="left__panel">
			<p class="left__panel__title mb-3">
				Em torno da mesa ({{ occupiedPlayerSlots }}/{{ mesa.maxPlayers }})
			</p>

			<div
				class="player__card"
			>
				<div class="player__card-avatar">
					<n-icon>
						<IconPerson />
					</n-icon>
				</div>

				<div class="player__card-info">
					<span class="player__card-player">
						{{ mestre?.user?.name }} como
					</span>

					<span class="player__card-char">
						Mestre
					</span>
				</div>
			</div>

			<div
				class="player__card"
				v-for="player of jogadores"
				:key="player.id"
				:role="player.userCharacterId ? 'button' : undefined"
				:tabindex="player.userCharacterId ? 0 : undefined"
				@click="playerCardClick(player.id, player.userCharacterId)"
			>
				<div class="player__card-avatar">
					<img
						v-if="player.userCharacter?.imageUrl"
						:src="player.userCharacter.imageUrl"
						:alt="player.userCharacter?.name ?? player.user.name"
						class="player__card-avatar-img"
					>
					<n-icon v-else>
						<IconPerson />
					</n-icon>
				</div>

				<div class="player__card-info">
					<span class="player__card-player">
						{{ player.user.name }} como
					</span>

					<span class="player__card-char">
						{{ player.userCharacter?.name ?? 'Personagem não definido' }}
					</span>
				</div>
			</div>

			<div
				class="player__card player__card--empty"
				v-for="n in vagasLivres"
				:key="`vaga-${n}`"
				role="button"
				tabindex="0"
				@click="vagaLivreClick"
			>
				<div class="player__card-avatar player__card-avatar--empty">
					<n-icon>
						<IconAdd />
					</n-icon>
				</div>

				<div class="player__card-info">
					<span
						class="player__card-player"
						style="font-size: 0.75rem;"
					>
						Vaga livre
					</span>
				</div>
			</div>

			<div v-if="espectadores.length || canJoinAsSpectator" class="spectators__section">
				<p class="spectators__title">
					Espectadores
				</p>

				<div
					v-for="spectator of espectadores"
					:key="spectator.id"
					class="spectator__card"
				>
					<div class="spectator__card-avatar">
						<n-icon>
							<IconPerson />
						</n-icon>
					</div>

					<span class="spectator__card-name">
						{{ spectator.user.name }}
					</span>

					<n-button
						v-if="isOwnerMesa"
						class="spectator__card-expel"
						:class="{ 'spectator__card-expel--loading': expellingSpectatorId === spectator.id }"
						quaternary
						circle
						size="tiny"
						:focusable="false"
						:loading="expellingSpectatorId === spectator.id"
						aria-label="Expulsar espectador"
						@click.stop="expelSpectatorClick(spectator.id, spectator.user.name)"
					>
						<template #icon>
							<n-icon>
								<IconExpel />
							</n-icon>
						</template>
					</n-button>
				</div>

				<button
					v-if="canJoinAsSpectator"
					type="button"
					class="spectator__card spectator__card--join"
					:disabled="isJoiningAsSpectator"
					@click.prevent="joinAsSpectatorClick"
				>
					<div class="spectator__card-avatar spectator__card-avatar--join">
						<n-icon>
							<IconEye />
						</n-icon>
					</div>

					<span class="spectator__card-name">
						{{ isJoiningAsSpectator ? 'Entrando...' : 'Entrar como espectador' }}
					</span>
				</button>
			</div>
		</div>

		<SidePanel v-model:collapsed="isRightPanelCollapsed" class="right__panel">
			<SideChatPanel
				:posts="sideChatPosts"
				:is-master="currentPlayer?.role === 'MASTER'"
				:current-player-id="currentPlayer?.id"
			/>
		</SidePanel>

		<div class="mid__container">
			<PostsTimeline
				ref="postsTimeline"
				:mesa-id="Number(mesaId)"
				:is-master="currentPlayer?.role === 'MASTER'"
				:current-player-id="currentPlayer?.id"
				v-model:posts="posts"
			/>
		</div>
		
		<div class="bottom__input">
			<div class="input__container">
				<PostEditor
					v-model="postMessage"
					v-model:post-type="postMessageType"
					v-model:visible-player-ids="postVisiblePlayerIds"
					:mention-items="mentionItems"
					:allowed-post-types="allowedPostTypes"
					:players="targetablePlayers"
				/>

				<button
					type="button"
					class="send__btn"
					:disabled="isPostMessageEmpty || isSendingPost"
					aria-label="Enviar mensagem"
					@click.prevent="sendPostButtonClick"
				>
					<n-icon
						:class="{ 'send__btn-icon--loading': isSendingPost }"
					>
						<IconSend />
					</n-icon>
				</button>
			</div>
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
	grid-template-columns: 280px 1fr auto;
	grid-template-rows: 80px 1fr auto;
	height: 100%;

	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.center__container {
	display: flex;
	justify-content: center;
	align-items: center;
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

.header__last-update {
	display: flex;
	align-items: center;
	gap: 4px;
	flex-shrink: 0;

	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.7rem;

	cursor: pointer;
	transition: color 0.15s ease;
}

.header__last-update:hover .header__last-update-icon {
	transform: rotate(180deg);
}

.header__last-update-icon {
	font-size: 0.9rem;
	transition: transform 0.3s ease;
}

.header__last-update:hover {
	color: var(--cor-latao);
}

.left__panel {
	grid-area: left__panel;
	display: flex;
	flex-direction: column;
	min-height: 0;
	overflow-y: auto;

	padding: var(--space-4);
	border-right: 1px solid var(--cor-linha);
	scrollbar-width: thin;
	scrollbar-color: var(--cor-linha) transparent;
}

.left__panel::-webkit-scrollbar {
	width: 6px;
}

.left__panel::-webkit-scrollbar-thumb {
	background: var(--cor-linha);
	border-radius: 3px;
}

.left__panel::-webkit-scrollbar-track {
	background: transparent;
}

.left__panel__title {
	text-transform: uppercase;
	font-size: 0.65rem;
	font-weight: 600;
	color: var(--cor-tinta-fraca);
}

.player__card {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: var(--space-3);

	padding: var(--space-3);
	margin-bottom: var(--space-2);

	cursor: pointer;

	background: var(--cor-papel);
	border: 1px solid var(--cor-linha);
	border-radius: 10px;
	transition: border-color 0.15s ease, transform 0.15s ease;
}

.player__card:hover {
	border-color: var(--cor-latao);
	transform: translateY(-1px);
}

.player__card-avatar {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	height: 40px;
	width: 40px;

	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	border-radius: 50%;
	color: var(--cor-tinta-fraca);
	font-size: 1.1rem;

	overflow: hidden;
	transition: border-color 0.15s ease;
}

.player__card:hover .player__card-avatar {
	border-color: var(--cor-latao);
}

.player__card-avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.player__card-info {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.player__card-char {
	font-family: var(--font-serif);
	color: var(--cor-tinta);
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.2;
}

.player__card-player {
	font-family: var(--font-sans);
	color: var(--cor-tinta-fraca);
	font-size: 0.6rem;
}

.player__card--empty {
	align-items: center;

	background: transparent;
	border: 1px dashed var(--cor-linha);
	cursor: pointer;
	transition: border-color 0.15s ease, color 0.15s ease;
}

.player__card--empty .player__card-player {
	color: var(--cor-tinta-fraca);
}

.player__card--empty:hover {
	border-color: var(--cor-latao);
}

.player__card--empty:hover .player__card-player {
	color: var(--cor-latao);
}

.player__card-avatar--empty {
	background: transparent;
	border: 1px dashed var(--cor-linha);
}

.spectators__section {
	display: flex;
	flex-direction: column;
	gap: 4px;

	margin-top: var(--space-3);
	padding-top: var(--space-3);
	border-top: 1px solid var(--cor-linha);
}

.spectators__title {
	text-transform: uppercase;
	font-size: 0.6rem;
	color: var(--cor-tinta-fraca);
	opacity: 0.6;
	margin-bottom: 2px;
}

.spectator__card {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: var(--space-2);

	padding: 6px var(--space-2);

	border: 1px solid transparent;
	border-radius: 8px;
	opacity: 0.6;
	transition: border-color 0.15s ease, background-color 0.15s ease, opacity 0.15s ease;
}

.spectator__card:hover {
	border-color: var(--cor-linha);
	background: var(--cor-papel);
	opacity: 1;
}

.spectator__card-avatar {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	height: 24px;
	width: 24px;

	border: 1px solid var(--cor-linha);
	border-radius: 50%;
	color: var(--cor-tinta-fraca);
	font-size: 0.75rem;

	transition: border-color 0.15s ease;
}

.spectator__card:hover .spectator__card-avatar {
	border-color: var(--cor-latao);
}

.spectator__card-name {
	flex: 1;
	min-width: 0;

	font-family: var(--font-sans);
	font-size: 0.7rem;
	color: var(--cor-tinta-fraca);

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.spectator__card-expel {
	flex-shrink: 0;

	opacity: 0;
	color: var(--cor-tinta-fraca);
	transition: opacity 0.15s ease, color 0.15s ease;
}

.spectator__card:hover .spectator__card-expel,
.spectator__card-expel--loading {
	opacity: 1;
}

.spectator__card-expel:hover {
	color: var(--cor-granada);
}

.spectator__card--join {
	width: 100%;

	background: transparent;
	border: 1px dashed var(--cor-linha);
	cursor: pointer;
	opacity: 1;
}

.spectator__card--join:hover:not(:disabled) {
	border-color: var(--cor-latao);
	background: var(--cor-papel);
}

.spectator__card--join:hover:not(:disabled) .spectator__card-avatar--join,
.spectator__card--join:hover:not(:disabled) .spectator__card-name {
	border-color: var(--cor-latao);
	color: var(--cor-latao);
}

.spectator__card--join:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.spectator__card-avatar--join {
	border-style: dashed;
}

.player__card--empty:hover .player__card-avatar--empty {
	border-color: var(--cor-latao);
	color: var(--cor-latao);
}

.right__panel {
	grid-area: right__panel;
	min-height: 0;
}

.mid__container {
	grid-area: mid__container;
	display: flex;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
}

.bottom__input {
	grid-area: bottom__input;
	display: flex;
	min-height: 120px;
	overflow: hidden;

	padding: var(--space-2) var(--space-4);
}

.input__container {
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	gap: var(--space-2);
	flex: 1;
	min-height: 0;
}

.input__container :deep(.post-editor) {
	flex: 1;
}

.send__btn {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	width: 50px;
	height: 50px;

	background: var(--cor-granada);
	border: none;
	border-radius: 10px;
	box-shadow: var(--shadow);
	color: var(--cor-papel);
	cursor: pointer;
	font-size: 1.2rem;

	transition: background-color 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
}

.send__btn:hover:not(:disabled) {
	background: var(--cor-latao);
}

.send__btn:active:not(:disabled) {
	transform: scale(0.95);
}

.send__btn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.send__btn-icon--loading {
	animation: send-btn-spin 0.8s linear infinite;
}

@keyframes send-btn-spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.center__container {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;

	height: 300px;
}

</style>
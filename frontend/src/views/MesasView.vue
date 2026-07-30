<script setup lang="ts">
import { getAllMesaPaginated } from '@/services/mesas.service'
import { MesaResponse } from '@/types/mesaTypes'
import { ref, watch } from 'vue'
import { SearchOutline as IconSearch, PeopleOutline as IconUsers } from '@vicons/ionicons5'
import { NInput, NIcon, NPagination, NSpin, useMessage } from 'naive-ui'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuthStore } from '@/stores/useAuth'

const message = useMessage()
const auth = useAuthStore()

const LIMIT = 9
const SEARCH_DEBOUNCE_MS = 400

const mesas = ref<MesaResponse[]>([])
const searchMesa = ref('')
const page = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

let searchTimeout: ReturnType<typeof setTimeout>

async function fetchMesas() {
	try {
		isLoading.value = true

		const mesasResponse = await getAllMesaPaginated({
			page: page.value,
			limit: LIMIT,
			search: searchMesa.value || undefined
		})

		mesas.value = mesasResponse.data
		totalPages.value = mesasResponse.meta.totalPages
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		isLoading.value = false
	}
}

watch(page, fetchMesas)

watch(searchMesa, () => {
	clearTimeout(searchTimeout)

	searchTimeout = setTimeout(() => {
		page.value = 1
		fetchMesas()
	}, SEARCH_DEBOUNCE_MS)
})

fetchMesas()
</script>

<template>
	<div>
		<n-input v-model:value="searchMesa" type="text" placeholder="Procurar mesa">
			<template #prefix>
				<n-icon :component="IconSearch" />
			</template>
		</n-input>

		<div class="empty__card" v-if="mesas.length === 0 ? true : false">
			<p>
				Não há nenhuma mesa para exibir
			</p>
		</div>
		
		<div
			class="center__container"
			v-if="isLoading"
		>
			<n-spin size="large" />
		</div>

		<div v-else>
			<div class="cards__wrapper">
				<div
					class="card__mesa"
					v-for="mesa in mesas"
					:key="mesa.id"
				>
					<div>
						<p class="card__mesa__title">{{ mesa.title }}</p>

						<p class="card__mesa__subtitle">"{{ mesa.description }}"</p>
					</div>

					<div class="card__mesa__footer">
						<p>
							Criador por {{ mesa.creator.name }} desde {{ format(mesa.createdAt, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) }}
						</p>

						<div class="players__count__wrapper">
							<n-icon :component="IconUsers" size="18" />

							<p>{{ mesa._count.players }}</p>
						</div>
					</div>
				</div>
			</div>

			<n-pagination v-if="totalPages > 1" v-model:page="page" :page-count="totalPages" class="pagination" />
		</div>
	</div>
</template>

<style scoped>
.cards__wrapper {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
	gap: var(--space-5);

	margin-top: var(--space-6);
}

.card__mesa {
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	padding: var(--space-3);
	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	box-shadow: var(--shadow);

	height: 240px;
	cursor: pointer;
	transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card__mesa:hover {
	box-shadow: var(--shadow-hover, var(--shadow));
	transform: translateY(-2px);
}

.card__mesa__title {
	font-family: var(--font-serif);
	color: var(--cor-granada);
	font-size: 1.1rem;
	font-weight: 600;

	margin-bottom: var(--space-2);
}

.card__mesa__subtitle {
	font-family: var(--font-serif);
	color: var(--cor-tinta);
	font-size: 0.9rem;
	font-style: italic;

	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.card__mesa__footer {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.card__mesa__footer>p {
	font-family: var(--font-sans);
	font-size: 0.7rem;
	color: var(--cor-tinta-fraca);
}

.players__count__wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 6px;
	border: 1px solid var(--cor-linha);

	padding: var(--space-1) var(--space-2);

	font-family: var(--font-sans);
}

.players__count__wrapper :first-child {
	margin-right: var(--space-2);
}

.pagination {
	display: flex;
	justify-content: center;
	margin-top: var(--space-6);
}

.center__container {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;

	height: 300px;
}

.empty__card {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;

	height: 100px;

	margin-top: var(--space-6);

	
	border-radius: 8px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
}

.empty__card > p {
	font-family: var(--font-sans);
	font-size: 0.85rem;
	color: var(--cor-granada);
}
</style>

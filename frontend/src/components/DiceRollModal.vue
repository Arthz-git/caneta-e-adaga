<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { NButton, NIcon, NInputNumber, NModal } from 'naive-ui'
import { CloseOutline as IconClose, DiceOutline as IconDice } from '@vicons/ionicons5'

// ----------------------------------------------------------------------

const DICE_SIDES = [4, 6, 8, 10, 12, 16, 20] as const

const show = defineModel<boolean>('show', { required: true })

const emit = defineEmits<{
	roll: [text: string]
}>()

const quantities = reactive<Record<number, number>>(
	Object.fromEntries(DICE_SIDES.map(sides => [sides, 0])) as Record<number, number>
)
const modifier = ref<number | null>(null)

const hasDiceSelected = computed(() => DICE_SIDES.some(sides => quantities[sides] > 0))

function rollDie(sides: number) {
	return Math.floor(Math.random() * sides) + 1
}

function resetForm() {
	DICE_SIDES.forEach((sides) => {
		quantities[sides] = 0
	})
	modifier.value = null
}

function rollButtonClick() {
	if (!hasDiceSelected.value) return

	const parts: string[] = []
	let total = 0

	for (const sides of DICE_SIDES) {
		const quantity = quantities[sides]
		if (!quantity) continue

		const rolls = Array.from({ length: quantity }, () => rollDie(sides))
		total += rolls.reduce((sum, roll) => sum + roll, 0)

		parts.push(`${quantity}d${sides} (${rolls.join(', ')})`)
	}

	let formula = parts.join(' + ')

	if (modifier.value) {
		total += modifier.value
		formula += modifier.value > 0 ? ` + ${modifier.value}` : ` - ${Math.abs(modifier.value)}`
	}

	emit('roll', `${formula} = ${total}`)

	resetForm()
	show.value = false
}

function handleAfterLeave() {
	resetForm()
}
</script>

<template>
	<n-modal v-model:show="show" :on-after-leave="handleAfterLeave">
		<div class="modal__container">
			<div class="modal__header">
				<h2 class="modal__title">
					Jogar dado
				</h2>

				<n-button quaternary circle :focusable="false" @click="show = false">
					<template #icon>
						<n-icon>
							<IconClose />
						</n-icon>
					</template>
				</n-button>
			</div>

			<div class="modal__dice-grid">
				<div v-for="sides of DICE_SIDES" :key="sides" class="modal__dice-field">
					<span class="modal__dice-label">d{{ sides }}</span>
					<n-input-number
						v-model:value="quantities[sides]"
						:min="0"
						:max="99"
						placeholder="0"
					/>
				</div>
			</div>

			<div class="modal__modifier-field">
				<span class="modal__dice-label">Modificador</span>
				<n-input-number
					v-model:value="modifier"
					placeholder="Opcional, ex: 3 ou -2"
					class="modal__modifier-input"
				/>
			</div>

			<n-button
				type="primary"
				block
				strong
				:disabled="!hasDiceSelected"
				:focusable="false"
				@click="rollButtonClick"
			>
				<template #icon>
					<n-icon>
						<IconDice />
					</n-icon>
				</template>
				Rolar
			</n-button>
		</div>
	</n-modal>
</template>

<style scoped>
.modal__container {
	width: 90vw;
	max-width: 480px;
	padding: var(--space-6) var(--space-5);
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	box-shadow: var(--shadow);
}

.modal__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.modal__title {
	color: var(--cor-granada);
}

.modal__dice-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
	gap: var(--space-3);
}

.modal__dice-field {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.modal__dice-label {
	color: var(--cor-tinta-fraca);
	font-family: var(--font-sans);
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.03em;
}

.modal__modifier-field {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.modal__modifier-input {
	width: 100%;
}
</style>

<script setup lang="ts">
import { reactive } from 'vue'
import { NForm, NFormItem, NInput, NButton, NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import IconArrowLeft from '~icons/feather/arrow-left'

const registerForm = reactive({
	username: '',
	email: '',
	password: '',
	confirmPassword: ''
})

const handleRegisterSubmit = () => {

}

</script>

<template>
	<div class="register">
		<router-link to="/auth/login" class="register__back">
			<n-icon><IconArrowLeft /></n-icon>
			Voltar
		</router-link>

		<header class="register__header">
			<h2>Registrar</h2>

			<p class="register__subtitle">Registre sua conta e entre no seu mundo fantástico.</p>
		</header>

		<n-form class="register__form" label-placement="top" @submit.prevent="handleRegisterSubmit">
			<n-form-item label="E-mail">
				<n-input v-model:value="registerForm.username" type="text" placeholder="seu@email.com" />
			</n-form-item>

			<n-form-item label="E-mail">
				<n-input v-model:value="registerForm.email" type="text" placeholder="seu@email.com" />
			</n-form-item>

			<n-form-item label="Senha">
				<n-input v-model:value="registerForm.password" type="password" show-password-on="click"
					placeholder="********" />
			</n-form-item>

			<n-form-item label="Confirmar Senha">
				<n-input v-model:value="registerForm.confirmPassword" type="password" show-password-on="click"
					placeholder="********" />
			</n-form-item>

			<n-button type="primary" attr-type="submit" block strong>
				Registrar
			</n-button>
		</n-form>
	</div>
</template>

<style scoped>
.register {
	width: 100%;
	max-width: 360px;
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
}

.register__header h2 {
	margin-bottom: var(--space-2);
}

.register__subtitle {
	color: var(--text);
	font-size: 0.9375rem;
}

.register__form {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.register__back {
	display: inline-flex;
	align-items: center;
	gap: var(--space-2);
	align-self: flex-start;
	color: var(--text);
	font-size: 0.9375rem;
	text-decoration: none;
}

.register__back:hover {
	text-decoration: underline;
}
</style>
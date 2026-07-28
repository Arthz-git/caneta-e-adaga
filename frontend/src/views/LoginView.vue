<script setup lang="ts">
import { reactive } from 'vue'
import { NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'

const message = useMessage()
const auth = useAuthStore()
const router = useRouter()

const loginForm = reactive({
	email: '',
	password: '',
})

const handleLoginSubmit = async () => {
	if (!loginForm.email) {
		return message.warning('Email é um campo obrigatório')
	}

	if (!loginForm.password) {
		return message.warning('Password é um campo obrigatório')
	}

	try {
		await auth.login(loginForm.email, loginForm.password)

		message.success('Login efetuado com sucesso')

		router.push({ name: 'home' })
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
}
</script>

<template>
	<div class="login">
		<header class="login__header">
			<h2>Entrar</h2>

			<p class="login__subtitle">Acesse sua conta para continuar sua jornada.</p>
		</header>

		<n-form class="login__form" label-placement="top" @submit.prevent="handleLoginSubmit">
			<n-form-item label="Email">
				<n-input v-model:value="loginForm.email" type="text" placeholder="seu@email.com" />
			</n-form-item>

			<n-form-item label="Senha">
				<n-input v-model:value="loginForm.password" type="password" show-password-on="click"
					placeholder="********" />
			</n-form-item>

			<n-button type="primary" attr-type="submit" block strong>
				Entrar
			</n-button>
		</n-form>

		<p class="login__footer">
			Ainda não tem conta?
			<router-link to="/auth/register">Cadastre-se</router-link>
		</p>
	</div>
</template>

<style scoped>
.login {
	width: 100%;
	max-width: 360px;
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
}

.login__header h2 {
	margin-bottom: var(--space-2);
}

.login__subtitle {
	color: var(--text);
	font-size: 0.9375rem;
}

.login__form {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.login__footer {
	text-align: center;
	font-size: 0.9375rem;
	color: var(--text);
}

.login__footer a {
	color: var(--accent);
	font-weight: 600;
	text-decoration: none;
}

.login__footer a:hover {
	text-decoration: underline;
}
</style>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, NIcon, useMessage } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import IconMail from '~icons/feather/mail'
import IconLock from '~icons/feather/lock'
import { useAuthStore } from '@/stores/useAuth'

const message = useMessage()
const auth = useAuthStore()
const router = useRouter()

const loading = ref(false)

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

	loading.value = true

	try {
		await auth.login(loginForm.email, loginForm.password)

		message.success('Login efetuado com sucesso')

		router.push({ name: 'home' })
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
	finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="login">
		<header class="login__header">
			<h2>Entrar</h2>

			<p class="login__subtitle">Acesse sua conta para continuar sua jornada.</p>
		</header>

		<div class="login__card">
			<n-form class="login__form" label-placement="top" @submit.prevent="handleLoginSubmit">
				<n-form-item label="Email">
					<n-input v-model:value="loginForm.email" type="text" placeholder="seu@email.com">
						<template #prefix>
							<n-icon :component="IconMail" />
						</template>
					</n-input>
				</n-form-item>

				<n-form-item label="Senha">
					<n-input v-model:value="loginForm.password" type="password" show-password-on="click"
						placeholder="********">
						<template #prefix>
							<n-icon :component="IconLock" />
						</template>
					</n-input>
				</n-form-item>

				<n-button type="primary" attr-type="submit" block strong size="large" :loading="loading">
					Entrar
				</n-button>
			</n-form>
		</div>

		<p class="login__footer">
			Ainda não tem conta?
			<router-link to="/auth/register">Cadastre-se</router-link>
		</p>
	</div>
</template>

<style scoped>
.login {
	width: 100%;
	max-width: 380px;
	display: flex;
	flex-direction: column;
	gap: var(--space-6);
}

.login__header h2 {
	margin-bottom: var(--space-2);
}

.login__subtitle {
	color: var(--text);
	font-size: 0.9375rem;
}

.login__card {
	padding: var(--space-6) var(--space-5);
	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	box-shadow: var(--shadow);
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

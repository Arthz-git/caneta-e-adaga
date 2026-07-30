<script setup lang="ts">
import { reactive, ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, NIcon, useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { ArrowBackOutline as IconArrowLeft } from '@vicons/ionicons5'
import { registerUserService } from '@/services/register.service'

const message = useMessage()

const formRef = ref<FormInst | null>(null)

const initialStateForm = {
	name: '',
	email: '',
	password: '',
	confirmPassword: ''
}

const registerForm = reactive({ ...initialStateForm })

const rules: FormRules = {
	name: {
		required: true,
		message: 'Nome é um campo obrigatório',
		trigger: ['input', 'blur']
	},
	email: {
		required: true,
		type: 'email',
		message: 'Informe um email válido',
		trigger: ['input', 'blur']
	},
	password: [
		{
			required: true,
			message: 'Senha é um campo obrigatório',
			trigger: ['input', 'blur']
		},
		{
			min: 8,
			message: 'A senha deve ter no mínimo 8 caracteres',
			trigger: ['input', 'blur']
		},
		{
			pattern: /[a-z]/,
			message: 'A senha deve conter ao menos uma letra minúscula',
			trigger: ['input', 'blur']
		},
		{
			pattern: /[A-Z]/,
			message: 'A senha deve conter ao menos uma letra maiúscula',
			trigger: ['input', 'blur']
		},
		{
			pattern: /[0-9]/,
			message: 'A senha deve conter ao menos um número',
			trigger: ['input', 'blur']
		},
		{
			pattern: /[^a-zA-Z0-9]/,
			message: 'A senha deve conter ao menos um caractere especial',
			trigger: ['input', 'blur']
		}
	],
	confirmPassword: [
		{
			required: true,
			message: 'Confirmar senha é um campo obrigatório',
			trigger: ['input', 'blur']
		},
		{
			validator: (_rule, value: string) => value === registerForm.password,
			message: 'As senhas não são iguais',
			trigger: ['input', 'blur']
		}
	]
}

const handleRegisterSubmit = async () => {
	try {
		await formRef.value?.validate()

		await registerUserService({
			name: registerForm.name.trim(),
			email: registerForm.email.trim(),
			password: registerForm.password.trim()
		})

		message.success('Usuário criado com sucesso')

		Object.assign(registerForm, initialStateForm)
	}
	catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Não foi possível completar a operação. Tente novamente.'
		message.error(errorMessage)
	}
}

</script>

<template>
	<div class="register">
		<router-link to="/auth/login" class="register__back">
			<n-icon>
				<IconArrowLeft />
			</n-icon>
			Voltar
		</router-link>

		<header class="register__header">
			<h2>Registrar</h2>

			<p class="register__subtitle">Registre sua conta e entre no seu mundo fantástico.</p>
		</header>

		<div class="register__card">
			<n-form ref="formRef" :model="registerForm" :rules="rules" class="register__form" label-placement="top"
				@submit.prevent="handleRegisterSubmit">
				<n-form-item label="Nome/Username" path="name">
					<n-input v-model:value="registerForm.name" type="text" placeholder="Como quer ser chamado" />
				</n-form-item>

				<n-form-item label="Email" path="email">
					<n-input v-model:value="registerForm.email" type="text" placeholder="seu@email.com" />
				</n-form-item>

				<n-form-item label="Senha" path="password">
					<n-input v-model:value="registerForm.password" type="password" show-password-on="click"
						placeholder="********" />
				</n-form-item>

				<n-form-item label="Confirmar Senha" path="confirmPassword">
					<n-input v-model:value="registerForm.confirmPassword" type="password" show-password-on="click"
						placeholder="********" />
				</n-form-item>

				<n-button type="primary" attr-type="submit" block strong>
					Registrar
				</n-button>
			</n-form>
		</div>
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

.register__card {
	padding: var(--space-6) var(--space-5);
	border-radius: 16px;
	background: var(--cor-papel-elevado);
	border: 1px solid var(--cor-linha);
	box-shadow: var(--shadow);
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
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	PORT: z.coerce.number({ error: 'A porta deve ser um número' }).default(3000),
	DATABASE_URL: z.string().url('A URL do banco de dados é inválida'),
	FRONTEND_URL: z.string().url('A URL do frontend é inválida'),
	JWT_SECRET: z.string().min(32, 'O JWT_SECRET deve ter pelo menos 32 caracteres'),
	JWT_EXPIRES_IN: z.coerce.number().positive(),
	REFRESH_TOKEN_TTL_DAYS: z.coerce.number().positive()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('Variáveis de ambiente inválidas:', _env.error.format())
	throw new Error('Configuração de ambiente inválida.')
}

export const env = _env.data
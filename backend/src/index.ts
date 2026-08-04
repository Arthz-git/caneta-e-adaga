import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import { authRoutes } from './modules/auth/routes/auth.route'
import { usersRoutes } from './modules/users/routes/users.routes'
import { generateOpenApiDocument } from './shared/openapi/document'
import { errorHandler } from './shared/http/middlewares/errorHandler'
import { userCharactersRoutes } from './modules/userCharacters/routes/userCharacters.routes'
import { mesaRoutes } from './modules/mesas/routes/mesas.routes'
import { env } from './config/env'
import { playerRoutes } from './modules/players/routes/players.routes'
import { solicitacaoRoutes } from './modules/solicitacoes/routes/solicitacoes.routes'

const app = express()

app.use(cors({
	origin: env.FRONTEND_URL,
	credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req: Request, res: Response) => {
	res.json({
		status: 'ok',
		message: 'Servidor rodando normalmente'
	})
})

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/characters', userCharactersRoutes)
app.use('/mesas', mesaRoutes)
app.use('/players', playerRoutes)
app.use('/solicitacoes', solicitacaoRoutes)

const openApiDocument = generateOpenApiDocument()

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))

app.use(errorHandler)

app.listen(env.PORT, () => {
	console.log(`Servidor rodando: http://localhost:${env.PORT}/docs`)
})

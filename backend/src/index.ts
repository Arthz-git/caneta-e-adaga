import express from 'express'
import type { Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import { authRoutes } from './modules/auth/routes/auth.route'
import { usersRoutes } from './modules/users/routes/users.routes'
import { generateOpenApiDocument } from './shared/openapi/document'
import { errorHandler } from './shared/http/middlewares/errorHandler'
import { userCharactersRoutes } from './modules/userCharacters/routes/userCharacters.routes'
import { mesaRoutes } from './modules/mesas/routes/mesas.routes'
import { createServer } from 'node:http'
import { createSocketIOServer } from './shared/websocket/io'
import { env } from './config/env'

const app = express()
const httpServer = createServer(app)

createSocketIOServer(httpServer)

app.use(express.json())

app.get('/health', (req: Request, res: Response) => {
	res.json({
		status: 'ok',
		message: 'Servidor rodando normalmente'
	})
})

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/characters', userCharactersRoutes)
app.use('/mesa', mesaRoutes)

const openApiDocument = generateOpenApiDocument()

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))

app.use(errorHandler)

httpServer.listen(env.PORT, () => {
	console.log(`Servidor rodando: http://localhost:${env.PORT}/docs`)
})

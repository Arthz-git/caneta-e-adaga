import express from 'express'
import type { Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import { authRoutes } from './modules/auth/routes/auth.route'
import { usersRoutes } from './modules/users/routes/users.routes'
import { generateOpenApiDocument } from './shared/openapi/document'
import { errorHandler } from './shared/http/middlewares/errorHandler'
import { userCharactersRoutes } from './modules/userCharacters/routes/userCharacters.routes'

const app = express()
const PORT = process.env.PORT || 3000

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

const openApiDocument = generateOpenApiDocument()

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Servidor rodando: http://localhost:${PORT}/docs`)
})

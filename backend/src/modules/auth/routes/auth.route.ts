import { Router } from 'express'
import { LoginController } from '../controllers/LoginController'
import { LogoutController } from '../controllers/LogoutController'
import { RefreshTokenController } from '../controllers/RefreshTokenController'
import { MeController } from '../controllers/MeController'
import { LogoutAllController } from '../controllers/LogoutAllController'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'

const authRoutes = Router()
const loginController = new LoginController()
const logoutController = new LogoutController()
const refreshTokenController = new RefreshTokenController()
const meController = new MeController()
const logoutAllController = new LogoutAllController()

authRoutes.post('/login', (req, res) => loginController.handle(req, res))
authRoutes.post('/logout', (req, res) => logoutController.handle(req, res))
authRoutes.post('/refresh', (req, res) => refreshTokenController.handle(req, res))
authRoutes.get('/me', ensureAuthenticated, (req, res) => meController.handle(req, res))
authRoutes.post('/logout-all', ensureAuthenticated, (req, res) => logoutAllController.handle(req, res))

export { authRoutes }
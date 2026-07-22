import { Router } from 'express'
import { CreateUserCharacterController } from '../controllers/createUserCharacterController'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'

const userCharactersRoutes = Router()

const createUserCharacterController = new CreateUserCharacterController()

userCharactersRoutes.post('/', ensureAuthenticated, (req, res) => createUserCharacterController.handle(req, res))

export { userCharactersRoutes }
import { Router } from 'express'
import { CreateUserCharacterController } from '../controllers/createUserCharacterController'
import { DeleteUserCharacterController } from '../controllers/deleteUserCharacterController'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'
import { UpdateUserCharacterController } from '../controllers/updateUserCharacterController'
import { FindUserCharacterController } from '../controllers/findUserCharacterController'
import { FindAllUserCharacterByUserIdController } from '../controllers/findAllUserCharacterByUserIdController'

const userCharactersRoutes = Router()

const createUserCharacterController = new CreateUserCharacterController()
const deleteUserCharacterController = new DeleteUserCharacterController()
const updateUserCharacterController = new UpdateUserCharacterController()
const findUserCharacterController = new FindUserCharacterController()
const findAllUserCharacterByUserIdController = new FindAllUserCharacterByUserIdController()

userCharactersRoutes.post('/', ensureAuthenticated, (req, res) => createUserCharacterController.handle(req, res))
userCharactersRoutes.delete('/:id', ensureAuthenticated, (req, res) => deleteUserCharacterController.handle(req, res))
userCharactersRoutes.put('/', ensureAuthenticated, (req, res) => updateUserCharacterController.handle(req, res))
userCharactersRoutes.get('/:id', ensureAuthenticated, (req, res) => findUserCharacterController.handle(req, res))
userCharactersRoutes.get('/userId/:userId', ensureAuthenticated, (req, res) => findAllUserCharacterByUserIdController.handle(req, res))

export { userCharactersRoutes }
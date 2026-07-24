import { Router } from 'express'
import { CreateUserController } from '../controllers/CreateUserController'
import { GetUserByEmailController } from '../controllers/GetUserByEmailController'
import { GetUserByIdController } from '../controllers/GetUserByIdController'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'
import { authorize } from '../../../shared/http/middlewares/authorize'
import { Role } from '../../../shared/constants/roles'

const usersRoutes = Router()

const createUserController = new CreateUserController()
const getUserByIdController = new GetUserByIdController()
const getUserByEmailController = new GetUserByEmailController()

usersRoutes.post('/', (req, res) => createUserController.handle(req, res))
usersRoutes.get(
	'/email/:email',
	ensureAuthenticated,
	authorize(Role.ADMIN),
	(req, res) => getUserByEmailController.handle(req, res)
)
usersRoutes.get('/:id', ensureAuthenticated, (req, res) => getUserByIdController.handle(req, res))

export { usersRoutes }

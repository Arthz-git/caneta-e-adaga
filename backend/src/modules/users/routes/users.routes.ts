import { Router } from 'express'
import { CreateUserController } from '../controllers/CreateUserController'
import { FindUserByEmailController } from '../controllers/FindUserByEmailController'
import { FindUserByIdController } from '../controllers/FindUserByIdController'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'
import { authorize } from '../../../shared/http/middlewares/authorize'
import { Role } from '../../../shared/constants/roles'

const usersRoutes = Router()

const createUserController = new CreateUserController()
const findUserByIdController = new FindUserByIdController()
const findUserByEmailController = new FindUserByEmailController()

usersRoutes.post('/', (req, res) => createUserController.handle(req, res))
usersRoutes.get(
	'/email/:email',
	ensureAuthenticated,
	authorize(Role.ADMIN),
	(req, res) => findUserByEmailController.handle(req, res)
)
usersRoutes.get('/:id', ensureAuthenticated, (req, res) => findUserByIdController.handle(req, res))

export { usersRoutes }

import { Router } from 'express'
import { createImageUpload } from '../../../shared/upload/imageUpload'
import { CreateUserCharacterController } from '../controllers/createUserCharacterController'
import { DeleteUserCharacterController } from '../controllers/deleteUserCharacterController'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'
import { UpdateUserCharacterController } from '../controllers/updateUserCharacterController'
import { GetUserCharacterController } from '../controllers/getUserCharacterController'
import { GetAllUserCharacterByUserIdController } from '../controllers/getAllUserCharacterByUserIdController'
import { GetUserCharacterSheetHistoryController } from '../controllers/getUserCharacterSheetHistoryController'

const userCharactersRoutes = Router()
const uploadCharacterImage = createImageUpload('characters')

const createUserCharacterController = new CreateUserCharacterController()
const deleteUserCharacterController = new DeleteUserCharacterController()
const updateUserCharacterController = new UpdateUserCharacterController()
const getUserCharacterController = new GetUserCharacterController()
const getAllUserCharacterByUserIdController = new GetAllUserCharacterByUserIdController()
const getUserCharacterSheetHistoryController = new GetUserCharacterSheetHistoryController()

userCharactersRoutes.post('/', ensureAuthenticated, uploadCharacterImage.single('image'), (req, res) => createUserCharacterController.handle(req, res))
userCharactersRoutes.delete('/:id', ensureAuthenticated, (req, res) => deleteUserCharacterController.handle(req, res))
userCharactersRoutes.put('/:id', ensureAuthenticated, uploadCharacterImage.single('image'), (req, res) => updateUserCharacterController.handle(req, res))
userCharactersRoutes.get('/:id', ensureAuthenticated, (req, res) => getUserCharacterController.handle(req, res))
userCharactersRoutes.get('/:id/sheet-history', ensureAuthenticated, (req, res) => getUserCharacterSheetHistoryController.handle(req, res))
userCharactersRoutes.get('/userId/:userId', ensureAuthenticated, (req, res) => getAllUserCharacterByUserIdController.handle(req, res))

export { userCharactersRoutes }
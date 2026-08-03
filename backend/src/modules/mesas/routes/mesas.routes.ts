import { Router } from 'express'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'
import { createImageUpload } from '../../../shared/upload/imageUpload'

import { CreateMesaController } from '../controllers/createMesaController'
import { UpdateMesaController } from '../controllers/updateMesaController'
import { DeleteMesaController } from '../controllers/deleteMesaController'
import { GetMesaController } from '../controllers/getMesaController'
import { GetAllMesaByCreatorController } from '../controllers/getAllMesaByCreatorController'
import { GetAllMesaController } from '../controllers/getAllMesaController'
import { GetAllMesaPaginatedController } from '../controllers/getAllMesaPaginatedController'

const mesaRoutes = Router()
const uploadMesaImage = createImageUpload('mesas')

const createMesaController = new CreateMesaController()
const updateMesaController = new UpdateMesaController()
const deleteMesaController = new DeleteMesaController()
const getMesaController = new GetMesaController()
const getAllMesaByCreatorController = new GetAllMesaByCreatorController()
const getAllMesaController = new GetAllMesaController()
const getAllMesaPaginatedController = new GetAllMesaPaginatedController()

mesaRoutes.get('/paginated', ensureAuthenticated, (req, res) => getAllMesaPaginatedController.handle(req, res))
mesaRoutes.get('/:id', ensureAuthenticated, (req, res) => getMesaController.handle(req, res))
mesaRoutes.get('/createdBy/:createdBy', ensureAuthenticated, (req, res) => getAllMesaByCreatorController.handle(req, res))
mesaRoutes.post('/', ensureAuthenticated, uploadMesaImage.single('image'), (req, res) => createMesaController.handle(req, res))
mesaRoutes.put('/:id', ensureAuthenticated, uploadMesaImage.single('image'), (req, res) => updateMesaController.handle(req, res))
mesaRoutes.delete('/:id', ensureAuthenticated, (req, res) => deleteMesaController.handle(req, res))
mesaRoutes.get('/', ensureAuthenticated, (req, res) => getAllMesaController.handle(req, res))

export { mesaRoutes }
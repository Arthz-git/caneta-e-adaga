import { Router } from 'express'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'

import { CreateMesaController } from '../controllers/createMesaController'
import { UpdateMesaController } from '../controllers/updateMesaController'
import { DeleteMesaController } from '../controllers/deleteMesaController'
import { GetMesaController } from '../controllers/getMesaController'
import { GetAllMesaByCreatorController } from '../controllers/getAllMesaByCreator'

const mesaRoutes = Router()

const createMesaController = new CreateMesaController()
const updateMesaController = new UpdateMesaController()
const deleteMesaController = new DeleteMesaController()
const getMesaController = new GetMesaController()
const getAllMesaByCreatorController = new GetAllMesaByCreatorController()

mesaRoutes.get('/:id', ensureAuthenticated, (req, res) => getMesaController.handle(req, res))
mesaRoutes.get('/createdBy/:createdBy', ensureAuthenticated, (req, res) => getAllMesaByCreatorController.handle(req, res))
mesaRoutes.post('/', ensureAuthenticated, (req, res) => createMesaController.handle(req, res))
mesaRoutes.put('/', ensureAuthenticated, (req, res) => updateMesaController.handle(req, res))
mesaRoutes.delete('/:id', ensureAuthenticated, (req, res) => deleteMesaController.handle(req, res))

export { mesaRoutes }
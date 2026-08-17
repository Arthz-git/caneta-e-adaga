import { Router } from 'express'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'

import { CreateAmizadeController } from '../controllers/createAmizadeController'
import { GetAmizadeController } from '../controllers/getAmizadeController'
import { GetAllAmizadesController } from '../controllers/getAllAmizadesController'
import { DeleteAmizadeController } from '../controllers/deleteAmizadeController'

const amizadeRoutes = Router()

const createAmizadeController = new CreateAmizadeController()
const getAmizadeController = new GetAmizadeController()
const getAllAmizadesController = new GetAllAmizadesController()
const deleteAmizadeController = new DeleteAmizadeController()

amizadeRoutes.get('/', ensureAuthenticated, (req, res) => getAllAmizadesController.handle(req, res))
amizadeRoutes.get('/:id', ensureAuthenticated, (req, res) => getAmizadeController.handle(req, res))
amizadeRoutes.post('/', ensureAuthenticated, (req, res) => createAmizadeController.handle(req, res))
amizadeRoutes.delete('/:id', ensureAuthenticated, (req, res) => deleteAmizadeController.handle(req, res))

export { amizadeRoutes }

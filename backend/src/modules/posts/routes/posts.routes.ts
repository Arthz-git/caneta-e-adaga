import { Router } from 'express'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'

import { CreatePostController } from '../controllers/createPostController'
import { GetAllPostsByMesaIdController } from '../controllers/getAllPostsByMesaIdController'
import { GetPaginatedPostsByMesaIdController } from '../controllers/getPaginatedPostsByMesaIdController'

const postRoutes = Router()

const createPostController = new CreatePostController()
const getAllPostsByMesaIdController = new GetAllPostsByMesaIdController()
const getPaginatedPostsByMesaIdController = new GetPaginatedPostsByMesaIdController()

postRoutes.post('/', ensureAuthenticated, (req, res) => createPostController.handle(req, res))
postRoutes.get('/mesaId/:mesaId/paginated', ensureAuthenticated, (req, res) => getPaginatedPostsByMesaIdController.handle(req, res))
postRoutes.get('/mesaId/:mesaId', ensureAuthenticated, (req, res) => getAllPostsByMesaIdController.handle(req, res))

export { postRoutes }

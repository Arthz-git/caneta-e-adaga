import { Router } from 'express'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'
import { createImageUpload } from '../../../shared/upload/imageUpload'

import { CreatePostController } from '../controllers/createPostController'
import { GetAllPostsByMesaIdController } from '../controllers/getAllPostsByMesaIdController'
import { GetPaginatedPostsByMesaIdController } from '../controllers/getPaginatedPostsByMesaIdController'
import { UploadPostImageController } from '../controllers/uploadPostImageController'

const postRoutes = Router()
const uploadPostImage = createImageUpload('posts')

const createPostController = new CreatePostController()
const getAllPostsByMesaIdController = new GetAllPostsByMesaIdController()
const getPaginatedPostsByMesaIdController = new GetPaginatedPostsByMesaIdController()
const uploadPostImageController = new UploadPostImageController()

postRoutes.post('/', ensureAuthenticated, (req, res) => createPostController.handle(req, res))
postRoutes.post('/image', ensureAuthenticated, uploadPostImage.single('image'), (req, res) => uploadPostImageController.handle(req, res))
postRoutes.get('/mesaId/:mesaId/paginated', ensureAuthenticated, (req, res) => getPaginatedPostsByMesaIdController.handle(req, res))
postRoutes.get('/mesaId/:mesaId', ensureAuthenticated, (req, res) => getAllPostsByMesaIdController.handle(req, res))

export { postRoutes }

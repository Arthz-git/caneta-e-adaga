import { Router } from 'express'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'

import { GetAllNotificacaoController } from '../controllers/getAllNotificacaoController'
import { GetNaoLidasCountController } from '../controllers/getNaoLidasCountController'
import { MarkAsReadController } from '../controllers/markAsReadController'
import { MarkAllAsReadController } from '../controllers/markAllAsReadController'
import { DeleteNotificacaoController } from '../controllers/deleteNotificacaoController'

const notificacaoRoutes = Router()

const getAllNotificacaoController = new GetAllNotificacaoController()
const getNaoLidasCountController = new GetNaoLidasCountController()
const markAsReadController = new MarkAsReadController()
const markAllAsReadController = new MarkAllAsReadController()
const deleteNotificacaoController = new DeleteNotificacaoController()

notificacaoRoutes.get('/', ensureAuthenticated, (req, res) => getAllNotificacaoController.handle(req, res))
notificacaoRoutes.get('/nao-lidas/count', ensureAuthenticated, (req, res) => getNaoLidasCountController.handle(req, res))
notificacaoRoutes.patch('/ler-todas', ensureAuthenticated, (req, res) => markAllAsReadController.handle(req, res))
notificacaoRoutes.patch('/:id/ler', ensureAuthenticated, (req, res) => markAsReadController.handle(req, res))
notificacaoRoutes.delete('/:id', ensureAuthenticated, (req, res) => deleteNotificacaoController.handle(req, res))

export { notificacaoRoutes }

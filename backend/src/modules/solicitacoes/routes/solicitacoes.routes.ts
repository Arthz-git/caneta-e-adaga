import { Router } from 'express'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'

import { CreateSolicitacaoController } from '../controllers/createSolicitacaoController'
import { GetSolicitacaoController } from '../controllers/getSolicitacaoController'
import { ResponderSolicitacaoController } from '../controllers/responderSolicitacaoController'
import { CancelarSolicitacaoController } from '../controllers/cancelarSolicitacaoController'
import { DeleteSolicitacaoController } from '../controllers/deleteSolicitacaoController'
import { GetAllSolicitacaoRecebidasController } from '../controllers/getAllSolicitacaoRecebidasController'
import { GetAllSolicitacaoEnviadasController } from '../controllers/getAllSolicitacaoEnviadasController'
import { GetMySolicitacaoByMesaIdController } from '../controllers/getMySolicitacaoByMesaIdController'

const solicitacaoRoutes = Router()

const createSolicitacaoController = new CreateSolicitacaoController()
const getSolicitacaoController = new GetSolicitacaoController()
const responderSolicitacaoController = new ResponderSolicitacaoController()
const cancelarSolicitacaoController = new CancelarSolicitacaoController()
const deleteSolicitacaoController = new DeleteSolicitacaoController()
const getAllSolicitacaoRecebidasController = new GetAllSolicitacaoRecebidasController()
const getAllSolicitacaoEnviadasController = new GetAllSolicitacaoEnviadasController()
const getMySolicitacaoByMesaIdController = new GetMySolicitacaoByMesaIdController()

solicitacaoRoutes.get('/recebidas', ensureAuthenticated, (req, res) => getAllSolicitacaoRecebidasController.handle(req, res))
solicitacaoRoutes.get('/enviadas', ensureAuthenticated, (req, res) => getAllSolicitacaoEnviadasController.handle(req, res))
solicitacaoRoutes.get('/:id', ensureAuthenticated, (req, res) => getSolicitacaoController.handle(req, res))
solicitacaoRoutes.post('/', ensureAuthenticated, (req, res) => createSolicitacaoController.handle(req, res))
solicitacaoRoutes.patch('/:id/responder', ensureAuthenticated, (req, res) => responderSolicitacaoController.handle(req, res))
solicitacaoRoutes.patch('/:id/cancelar', ensureAuthenticated, (req, res) => cancelarSolicitacaoController.handle(req, res))
solicitacaoRoutes.delete('/:id', ensureAuthenticated, (req, res) => deleteSolicitacaoController.handle(req, res))
solicitacaoRoutes.get('/mesaId/:mesaId', ensureAuthenticated, (req, res) => getMySolicitacaoByMesaIdController.handle(req, res))

export { solicitacaoRoutes }

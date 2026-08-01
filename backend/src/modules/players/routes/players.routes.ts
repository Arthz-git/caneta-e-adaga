import { Router } from 'express'
import { ensureAuthenticated } from '../../../shared/http/middlewares/ensureAuthenticated'

import { CreatePlayerController } from '../controllers/createPlayerController'
import { DeletePlayerController } from '../controllers/deletePlayerController'
import { UpdateRolePlayerController } from '../controllers/updateRolePlayerService'
import { UpdateCharacterPlayerController } from '../controllers/updateCharacterPlayerController'
import { GetPlayersByMesaIdController } from '../controllers/getPlayersByMesaIdController'
import { UpdateFavoritePlayerController } from '../controllers/UpdateFavoritePlayerController'

const playerRoutes = Router()

const createPlayerController = new CreatePlayerController()
const deletePlayerController = new DeletePlayerController()
const updateRolePlayerController = new UpdateRolePlayerController()
const updateCharacterPlayerController = new UpdateCharacterPlayerController()
const getPlayersByMesaIdController = new GetPlayersByMesaIdController()
const updateFavoritePlayerController = new UpdateFavoritePlayerController()

playerRoutes.post('/', ensureAuthenticated, (req, res) => createPlayerController.handle(req, res))
playerRoutes.delete('/:id', ensureAuthenticated, (req, res) => deletePlayerController.handle(req, res))
playerRoutes.patch('/role/:id', ensureAuthenticated, (req, res) => updateRolePlayerController.handle(req, res))
playerRoutes.patch('/character/:id', ensureAuthenticated, (req, res) => updateCharacterPlayerController.handle(req, res))
playerRoutes.patch('/favorite/:id', ensureAuthenticated, (req, res) => updateFavoritePlayerController.handle(req, res))
playerRoutes.get('/mesaId/:mesaId', ensureAuthenticated, (req, res) => getPlayersByMesaIdController.handle(req, res))

export { playerRoutes }
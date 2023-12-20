import express, { type RequestHandler, type Router } from 'express'
import apiController from '../controller/api.js'
// endpoint /api/...
const router: Router = express.Router()

router.post('/v1/shorten/', apiController.generateShortLinkController as RequestHandler)

router.get('/v1/links/:shortURL')
router.delete('/v1/links/:shortURL', apiController.deleteShortLinkController as RequestHandler)

export default router

import express, { type RequestHandler, type Router } from 'express'
import redirectController from '../controller/redirect.js'

// endpoint /...
const router: Router = express.Router()

router.get('/:shortURL', redirectController.redirect as RequestHandler)

export default router

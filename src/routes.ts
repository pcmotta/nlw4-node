import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { SurveyController } from './controllers/SurveyController'

const router = Router()

const userController = new UserController()
router.post('/users', userController.create)

const surveyController = new SurveyController()
router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)

export { router }
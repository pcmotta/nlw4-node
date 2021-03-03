import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { SurveyController } from './controllers/SurveyController'
import { SendEmailController } from './controllers/SendEmailController'

const router = Router()

const userController = new UserController()
router.post('/users', userController.create)

const surveyController = new SurveyController()
router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)

const sendEmailController = new SendEmailController()
router.post('/sendEmail', sendEmailController.execute)

export { router }
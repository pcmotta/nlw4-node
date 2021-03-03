import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import SendMailService from "../services/SendMailService";

import { resolve } from 'path'

class SendEmailController {
    async execute (request: Request, response: Response) {
        const { email, survey_id } = request.body

        const userRepository = getCustomRepository(UserRepository)
        const surveyRepository = getCustomRepository(SurveyRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const usuario = await userRepository.findOne({ email })
        if (!usuario) {
            return response.status(400).json({
                error: 'Usuário não existe'
            })
        }

        const survey = await surveyRepository.findOne({ id: survey_id })
        if (!survey) {
            return response.status(400).json({
                error: 'Survey não existe'
            })
        }

        let surveyUser = await surveyUserRepository.findOne({
            where: [{
                user_id: usuario.id
            }, {
                survey_id
            }],
            relations: ['user', 'survey']
        })

        if (!surveyUser) {
            surveyUser = surveyUserRepository.create({
                survey_id,
                user_id: usuario.id
            })
    
            await surveyUserRepository.save(surveyUser)
        }

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')
        const variables = {
            name: usuario.name,
            title: survey.title,
            description: survey.description,
            user_id: usuario.id,
            link: process.env.URL_MAIL
        }

        await SendMailService.execute(email, survey.title, variables, npsPath)

        return response.json(surveyUser)
    }
}

export { SendEmailController }
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";

class SurveyController {
    async create (request: Request, response: Response) {
        const { title, description } = request.body
        const repository = getCustomRepository(SurveyRepository)

        const survey = repository.create({
            title, description
        })
        
        await repository.save(survey)

        return response.status(201).json(survey)
    }

    async show (request: Request, response: Response) {
        const repository = getCustomRepository(SurveyRepository)
        const all = await repository.find()

        return response.json(all)
    }
}

export { SurveyController }
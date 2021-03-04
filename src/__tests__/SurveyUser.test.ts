import { app } from '../app'
import request from 'supertest'

import createConnection from '../database'

describe('SurveyUser', () => {
    let survey_id: string
    let surveyUser_id: string

    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    it('Deve ser possível enviar um e-mail', async () => {
        const responseUser = await request(app).post('/users').send({
            email: 'email@example.com',
            name: 'User Example'
        })

        const responseSurvey = await request(app).post('/surveys').send({
            title: 'Title Example 2',
            description: 'Description Example 2'
        })

        survey_id = responseSurvey.body.id

        const response = await request(app).post('/sendEmail').send({
            email: responseUser.body.email,
            survey_id
        })

        surveyUser_id = response.body.id

        expect(response.status).toBe(200)
    })

    it('Não se deve criar novo registro para mesmo usuário e pesquisa', async () => {
        const response = await request(app).post('/sendEmail').send({
            email: 'email@example.com',
            survey_id
        })

        expect(response.body.id).toBe(surveyUser_id)
    })
})
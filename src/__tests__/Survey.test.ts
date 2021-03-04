import { app } from '../app'
import request from 'supertest'

import createConnection from '../database'
import { getConnection } from 'typeorm'

describe('Surveys', () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        const connection = await getConnection()
        await connection.dropDatabase()
        await connection.close()
    })

    it('Deve ser possível criar uma nova Survey', async () => {
        const response = await request(app).post('/surveys').send({
            title: 'Title Example',
            description: 'Description Example'
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
    })

    it('Deve ser possível recuperar todas as Surveys', async () => {
        await request(app).post('/surveys').send({
            title: 'Title Example 2',
            description: 'Description Example 2'
        })

        const response = await request(app).get('/surveys')

        expect(response.body.length).toBe(2)
    })
})
import { app } from '../app'
import request from 'supertest'

import createConnection from '../database'

describe('Users', () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    it('Deve ser possível criar um novo usuário', async () => {
        const response = await request(app).post('/users').send({
            email: 'user@example.com',
            name: 'User Example'
        })

        expect(response.status).toBe(201)
    })

    it('Não deve ser possível criar usuário com e-mail existente', async () => {
        const response = await request(app).post('/users').send({
            email: 'user@example.com',
            name: 'User Example'
        })

        expect(response.status).toBe(400)
    })
})
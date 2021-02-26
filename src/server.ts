import express from 'express'

const app = express()

app.get('/', (_, response) => {
    return response.json({
        message: 'Hello World - NLW04'
    })
})

app.post('/', (_, response) => {
    return response.json({
        message: 'Os dados foram salvos com sucesso!'
    })
})

app.listen(3333, () => console.log('Server is Running...'))
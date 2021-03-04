import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { UserRepository } from "../repositories/UserRepository"
import * as yup from 'yup'
import { AppError } from "../errors/AppError"

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body

        const schema = yup.object().shape({
            name: yup.string().required('O nome é obrigatório'),
            email: yup.string().email('Informe um e-mail válido').required('O e-maill é obrigatório')
        })

        try {
            await schema.validate(request.body, { abortEarly: false })
        } catch (err) {
            throw new AppError(err)
        }

        const repository = getCustomRepository(UserRepository)
        const userExists = await repository.findOne({
            email
        })

        if (userExists) {
            throw new AppError('User Already Exists')
        }

        const user = repository.create({
            name, email
        })
        await repository.save(user)

        return response.status(201).json(user)
    }
}

export { UserController };

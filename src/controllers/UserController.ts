import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { UserRepository } from "../repositories/UserRepository"

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body

        const repository = getCustomRepository(UserRepository)
        const userExists = await repository.findOne({
            email
        })

        if (userExists) {
            return response.status(400).json({
                error: 'User Already Exists'
            })
        }

        const user = repository.create({
            name, email
        })
        await repository.save(user)

        return response.status(201).json(user)
    }
}

export { UserController };

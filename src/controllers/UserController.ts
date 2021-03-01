import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/User";


class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body

        const repository = getRepository(User)
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

        return response.json(user)
    }
}

export { UserController }
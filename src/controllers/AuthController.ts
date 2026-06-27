import { NextFunction, Response } from "express";
import { RegisterUserBody } from "../types/inedex";
import { UserService } from "../service/UserService";

export class AuthController {
    constructor(private userService: UserService) {}

    async register(req: RegisterUserBody, res: Response, next: NextFunction) {
        const { userName, email, password } = req.body;

        try {
            const user = await this.userService.create({
                userName,
                email,
                password,
            });

            res.json(user);
        } catch (error) {
            next(error);
            return;
        }
    }
}

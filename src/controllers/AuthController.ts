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

            res.cookie("accessToken", "abhauhdu323", {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1h,
                httpOnly: true,
            });

            res.cookie("refreshToken", "anjnd38hu38h", {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1h,
                httpOnly: true,
            });

            res.json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}

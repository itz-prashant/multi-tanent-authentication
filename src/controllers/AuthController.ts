import { NextFunction, Response } from "express";
import { RegisterUserBody } from "../types/inedex";
import { UserService } from "../services/UserService";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";
export class AuthController {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
    ) {}

    async register(req: RegisterUserBody, res: Response, next: NextFunction) {
        const { userName, email, password } = req.body;

        try {
            const user = await this.userService.create({
                userName,
                email,
                password,
            });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: String(user.role),
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1h,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y,
                httpOnly: true,
            });

            res.json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}

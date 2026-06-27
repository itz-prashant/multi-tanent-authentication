import { NextFunction, Response } from "express";
import { RegisterUserBody } from "../types/inedex";
import { UserService } from "../service/UserService";
import { JwtPayload } from "jsonwebtoken";
import { sign } from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import Config from "../config/env";
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

            const privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );

            const payload: JwtPayload = {
                sub: String(user.id),
                role: String(user.role),
            };

            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });

            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
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

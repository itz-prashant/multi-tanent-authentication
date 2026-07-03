import { NextFunction, Response } from "express";
import { AuthRequest, RegisterUserBody } from "../types/inedex";
import { UserService } from "../services/UserService";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";
import { Role } from "../generated/prisma/enums";
export class AuthController {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private credentialService: CredentialService,
    ) {}

    async register(req: RegisterUserBody, res: Response, next: NextFunction) {
        const { userName, email, password } = req.body;

        try {
            const user = await this.userService.create({
                userName,
                email,
                password,
                role: Role.CUSTOMER,
            });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: String(user.role),
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const newRefreshToken = await this.tokenService.persistRefreshToken(
                user.id,
            );

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

    async login(req: RegisterUserBody, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        try {
            const user = await this.userService.findByEmail(email);

            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or password does not match",
                );
                next(error);
                return;
            }

            const isPasswordMatch =
                await this.credentialService.comparePassword(
                    password,
                    user.password,
                );

            if (!isPasswordMatch) {
                const error = createHttpError(
                    400,
                    "Email or password does not match",
                );
                next(error);
                return;
            }
            const payload: JwtPayload = {
                sub: String(user.id),
                role: String(user.role),
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const newRefreshToken = await this.tokenService.persistRefreshToken(
                user.id,
            );

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

    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findById(req.auth.sub);
        res.json(user);
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        console.log(req.auth);

        try {
            const payload: JwtPayload = {
                sub: String(req.auth.sub),
                role: String(req.auth.role),
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const user = await this.userService.findById(req.auth.sub);

            if (!user) {
                const error = createHttpError(
                    400,
                    "User with the token could not find",
                );
                next(error);
                return;
            }

            const newRefreshToken = await this.tokenService.persistRefreshToken(
                user.id,
            );

            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

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

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.json({ message: "User has been logout" });
        } catch (error) {
            next(error);
            return;
        }
    }
}

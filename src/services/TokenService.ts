import createHttpError from "http-errors";
import { JwtPayload, sign } from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import Config from "../config/env";
import prisma from "../lib/prisma";
import { User } from "../generated/prisma/client";

export class TokenService {
    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
        } catch {
            const error = createHttpError(
                500,
                "Error while reading private key",
            );
            throw error;
        }
        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });

        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

        const newRefreshToken = await prisma.refreshToken.create({
            data: {
                userId: user.id,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            },
        });

        return newRefreshToken;
    }
}

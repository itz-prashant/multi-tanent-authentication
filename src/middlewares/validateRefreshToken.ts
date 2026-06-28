import { Request } from "express";
import { expressjwt } from "express-jwt";
import Config from "../config/env";
import { AuthCookie, IRefreshTokenPayload } from "../types/inedex";
import prisma from "../lib/prisma";

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ["HS256"],

    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;

        return refreshToken;
    },

    async isRevoked(req: Request, token) {
        try {
            const refreshToken = await prisma.refreshToken.findUnique({
                where: {
                    id: Number((token?.payload as IRefreshTokenPayload).id),
                    userId: String(token?.payload.sub),
                },
            });

            return refreshToken === null;
        } catch {
            console.error("Error while getting the refrsh token");
        }
        return true;
    },
});

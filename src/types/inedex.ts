import { Request } from "express";

export interface UserData {
    userName: string;
    email: string;
    password: string;
}

export interface RegisterUserBody extends Request {
    body: UserData;
}

export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: number;
    };
}

export interface IRefreshTokenPayload {
    id: string;
}

export interface TenantData {
    name: string;
    address: string;
}

export interface CreateTenantBody extends Request {
    body: TenantData;
}

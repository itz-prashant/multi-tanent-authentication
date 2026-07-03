import { Request } from "express";
import { Role } from "../generated/prisma/enums";

export interface UserData {
    userName: string;
    email: string;
    password: string;
    role: Role;
    tenantId?: number;
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
export interface CreateUserRequest extends Request {
    body: UserData;
}

export interface LimitedUserData {
    userName: string;
    email: string;
    role: Role;
}

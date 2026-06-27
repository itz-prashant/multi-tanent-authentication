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
};

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
    };
}

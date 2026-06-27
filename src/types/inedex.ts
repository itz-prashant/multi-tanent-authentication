import { Request } from "express";

export interface UserData {
    userName: string;
    email: string;
    password: string;
}

export interface RegisterUserBody extends Request {
    body: UserData;
}

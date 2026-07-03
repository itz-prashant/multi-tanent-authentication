import { NextFunction, Response, Request } from "express";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../types/inedex";
import createHttpError from "http-errors";

export class UserController {
    constructor(private userService: UserService) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { userName, email, password, role, tenantId } = req.body;

        try {
            const user = await this.userService.create({
                userName,
                email,
                password,
                role,
                tenantId,
            });

            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAll();

            res.json({ users });
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }
        try {
            const users = await this.userService.findById(String(userId));

            res.json({ users });
        } catch (error) {
            next(error);
        }
    }

    async update(req: CreateUserRequest, res: Response, next: NextFunction) {
        const userId = req.params.id;
        const { userName, email, role } = req.body;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }
        try {
            await this.userService.update(String(userId), {
                userName,
                email,
                role,
            });

            res.json({ id: userId });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }
        try {
            await this.userService.deleteById(String(userId));

            res.json({ id: userId });
        } catch (error) {
            next(error);
        }
    }
}

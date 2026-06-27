import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { validator } from "../validator/registerValidator";
import { registerSchema } from "../validator/auth.schema";
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";

const authRouter = express.Router();

const userService = new UserService();
const tokenService = new TokenService();
const authController = new AuthController(userService, tokenService);

authRouter.post(
    "/register",
    validator(registerSchema),
    (req: Request, res: Response, next: NextFunction) => {
        void authController.register(req, res, next);
    },
);

export default authRouter;

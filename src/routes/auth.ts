import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { validator } from "../validator/validator";
import { loginSchema, registerSchema } from "../validator/auth.schema";
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types/inedex";

const authRouter = express.Router();

const userService = new UserService();
const tokenService = new TokenService();
const credentialService = new CredentialService();
const authController = new AuthController(
    userService,
    tokenService,
    credentialService,
);

authRouter.post(
    "/register",
    validator(registerSchema),
    (req: Request, res: Response, next: NextFunction) => {
        void authController.register(req, res, next);
    },
);

authRouter.post(
    "/login",
    validator(loginSchema),
    (req: Request, res: Response, next: NextFunction) => {
        void authController.login(req, res, next);
    },
);

authRouter.get("/self", authenticate, (req, res) => {
    void authController.self(req as AuthRequest, res);
});

export default authRouter;

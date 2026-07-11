import express from "express";
import { UserController } from "../controllers/UserController";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { UserService } from "../services/UserService";
import { queryValidator } from "../validator/queryValidator";
import { userQuerySchema } from "../validator/userquery.schema";
import { Role } from "../generated/prisma/enums";

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post("/", authenticate, canAccess([Role.ADMIN]), (req, res, next) =>
    userController.create(req, res, next),
);

router.get("/", queryValidator(userQuerySchema), (req, res, next) =>
    userController.getAll(req, res, next),
);

router.get("/:id", authenticate, canAccess([Role.ADMIN]), (req, res, next) =>
    userController.getOne(req, res, next),
);

router.patch("/:id", authenticate, canAccess([Role.ADMIN]), (req, res, next) =>
    userController.update(req, res, next),
);

router.delete("/:id", authenticate, canAccess([Role.ADMIN]), (req, res, next) =>
    userController.delete(req, res, next),
);

export default router;

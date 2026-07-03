import express from "express";
import { UserController } from "../controllers/UserController";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../contsants";
import { UserService } from "../services/UserService";

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.create(req, res, next),
);

router.get("/", (req, res, next) => userController.getAll(req, res, next));

router.get("/:id", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getOne(req, res, next),
);

router.patch("/:id", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.update(req, res, next),
);

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.delete(req, res, next),
);

export default router;

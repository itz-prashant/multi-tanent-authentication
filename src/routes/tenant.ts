import express from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../contsants";
import { validator } from "../validator/validator";
import { tenantSchema } from "../validator/tenant.schema";

const router = express.Router();

const tenantService = new TenantService();
const tenantController = new TenantController(tenantService);

router.post(
    "/",
    validator(tenantSchema),
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.create(req, res, next),
);

export default router;

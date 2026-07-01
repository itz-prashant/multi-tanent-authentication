import { Response, NextFunction, Request } from "express";
import { CreateTenantBody } from "../types/inedex";
import { TenantService } from "../services/TenantService";
import createHttpError from "http-errors";

export class TenantController {
    constructor(private tenantService: TenantService) {}

    async create(req: CreateTenantBody, res: Response, next: NextFunction) {
        const { name, address } = req.body;

        try {
            const tenant = await this.tenantService.create({ name, address });

            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll();

            res.json(tenants);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, "Invalid url param.");
            next(error);
            return;
        }

        try {
            const tenant = await this.tenantService.findById(Number(tenantId));

            res.json(tenant);
        } catch (error) {
            next(error);
        }
    }
}

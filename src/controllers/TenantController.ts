import { Response, NextFunction } from "express";
import { CreateTenantBody } from "../types/inedex";
import { TenantService } from "../services/TenantService";

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
}

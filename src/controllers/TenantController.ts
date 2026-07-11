import { Response, NextFunction, Request } from "express";
import { CreateTenantBody, UserQueryParams } from "../types/inedex";
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
        const validateQuery = res.locals.validatedQuery as UserQueryParams;

        try {
            const [tenants, count] =
                await this.tenantService.getAll(validateQuery);

            res.json({
                data: tenants,
                total: count,
                perPage: validateQuery.perPage,
                currentPage: validateQuery.currentPage,
            });
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

    async update(req: CreateTenantBody, res: Response, next: NextFunction) {
        const tenantId = req.params.id;
        const { name, address } = req.body;

        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, "Invalid url param.");
            next(error);
            return;
        }

        try {
            await this.tenantService.updateById(Number(tenantId), {
                name,
                address,
            });

            res.json({
                message: `Tenant ${Number(tenantId)} update sucessfully`,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: CreateTenantBody, res: Response, next: NextFunction) {
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, "Invalid url param.");
            next(error);
            return;
        }
        try {
            await this.tenantService.deleteById(Number(tenantId));
            res.json({
                message: `Tenant ${Number(tenantId)} delete sucessfully`,
            });
        } catch (error) {
            next(error);
        }
    }
}

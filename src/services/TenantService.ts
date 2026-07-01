import prisma from "../lib/prisma";
import { TenantData } from "../types/inedex";

export class TenantService {
    async create(tenantData: TenantData) {
        return await prisma.tenant.create({
            data: {
                name: tenantData.name,
                address: tenantData.address,
            },
        });
    }

    async getAll() {
        return await prisma.tenant.findMany();
    }
}

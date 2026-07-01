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

    async findById(id: number) {
        return await prisma.tenant.findUnique({
            where: {
                id,
            },
        });
    }

    async updateById(id: number, tenantData: TenantData) {
        return await prisma.tenant.update({
            where: { id },
            data: {
                name: tenantData.name,
                address: tenantData.address,
            },
        });
    }

    async deleteById(id: number) {
        return await prisma.tenant.delete({
            where: { id },
        });
    }
}

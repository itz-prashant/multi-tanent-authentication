import { Prisma } from "../generated/prisma/client";
import prisma from "../lib/prisma";
import { TenantData, UserQueryParams } from "../types/inedex";

export class TenantService {
    async create(tenantData: TenantData) {
        return await prisma.tenant.create({
            data: {
                name: tenantData.name,
                address: tenantData.address,
            },
        });
    }

    async getAll(validateQuery: UserQueryParams) {
        const where: Prisma.TenantWhereInput = {};

        if (validateQuery.q) {
            where.OR = [
                {
                    name: {
                        contains: validateQuery.q,
                        mode: "insensitive",
                    },
                },
                {
                    address: {
                        contains: validateQuery.q,
                        mode: "insensitive",
                    },
                },
            ];
        }
        const [user, total] = await Promise.all([
            prisma.tenant.findMany({
                where,
                skip: (validateQuery.currentPage - 1) * validateQuery.perPage,
                take: validateQuery.perPage,
                orderBy: {
                    id: "desc",
                },
            }),

            prisma.tenant.count({ where }),
        ]);

        return [user, total];
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
